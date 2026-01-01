const { Comment, User } = require('../models');
const { pool } = require('../config/db');

// Get all comments for an article
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await Comment.findByArticle(articleId, parseInt(page), parseInt(limit));

    // Transform to match MongoDB format
    result.comments = result.comments.map(comment => ({
      ...comment,
      user: {
        _id: comment.user_id,
        username: comment.username,
        email: comment.email,
        avatar: comment.avatar
      },
      likeCount: comment.like_count,
      dislikeCount: comment.dislike_count
    }));

    res.json({
      success: true,
      comments: result.comments,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    const commentId = await Comment.create({
      article: articleId,
      user: req.user.userId,
      content: content.trim()
    });

    // Get the created comment with user data
    const sql = `
      SELECT c.*, u.username, u.email, u.avatar,
        0 as like_count, 0 as dislike_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const [comments] = await pool.execute(sql, [commentId]);
    const comment = comments[0];

    // Transform to match expected format
    const transformedComment = {
      ...comment,
      user: {
        _id: comment.user_id,
        username: comment.username,
        email: comment.email,
        avatar: comment.avatar
      },
      likeCount: 0,
      dislikeCount: 0
    };

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment: transformedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    // Check ownership
    const [comments] = await pool.execute('SELECT user_id FROM comments WHERE id = ?', [commentId]);
    
    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comments[0].user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    await Comment.update(commentId, content.trim());

    // Get updated comment
    const sql = `
      SELECT c.*, u.username, u.email, u.avatar,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id) as dislike_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const [updated] = await pool.execute(sql, [commentId]);

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: {
        ...updated[0],
        user: {
          _id: updated[0].user_id,
          username: updated[0].username,
          email: updated[0].email,
          avatar: updated[0].avatar
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check ownership
    const [comments] = await pool.execute('SELECT user_id FROM comments WHERE id = ?', [commentId]);
    
    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comments[0].user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    await Comment.delete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

// Like/Unlike comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    // Check if comment exists
    const [comments] = await pool.execute('SELECT id FROM comments WHERE id = ?', [commentId]);
    
    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const result = await Comment.toggleLike(commentId, userId);

    // Get updated counts
    const [counts] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) as likes,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = ?) as dislikes
    `, [commentId, commentId]);

    res.json({
      success: true,
      message: result.action === 'liked' ? 'Comment liked' : 'Like removed',
      likes: counts[0].likes,
      dislikes: counts[0].dislikes,
      isLiked: result.action === 'liked',
      isDisliked: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to like comment',
      error: error.message
    });
  }
};

// Dislike/Undislike comment
exports.dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    // Check if comment exists
    const [comments] = await pool.execute('SELECT id FROM comments WHERE id = ?', [commentId]);
    
    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const result = await Comment.toggleDislike(commentId, userId);

    // Get updated counts
    const [counts] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) as likes,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = ?) as dislikes
    `, [commentId, commentId]);

    res.json({
      success: true,
      message: result.action === 'disliked' ? 'Comment disliked' : 'Dislike removed',
      likes: counts[0].likes,
      dislikes: counts[0].dislikes,
      isLiked: false,
      isDisliked: result.action === 'disliked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dislike comment',
      error: error.message
    });
  }
};