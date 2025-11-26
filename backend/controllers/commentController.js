const Comment = require('../models/Comment');
const User = require('../models/User');

// Get all comments for an article
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ article: articleId })
      .populate('user', 'username avatar email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Comment.countDocuments({ article: articleId });

    res.json({
      success: true,
      comments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
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

    const comment = new Comment({
      article: articleId,
      user: req.user.userId,
      content: content.trim()
    });

    await comment.save();

    // Populate user data before sending response
    await comment.populate('user', 'username avatar email');

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment
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

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('user', 'username avatar email');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment
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

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    await Comment.findByIdAndDelete(commentId);

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

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Remove from dislikes if present
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);

    // Toggle like
    const likeIndex = comment.likes.findIndex(id => id.toString() === userId);
    
    if (likeIndex > -1) {
      // Already liked, so unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Not liked, so like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Like removed' : 'Comment liked',
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      isLiked: likeIndex === -1,
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

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Remove from likes if present
    comment.likes = comment.likes.filter(id => id.toString() !== userId);

    // Toggle dislike
    const dislikeIndex = comment.dislikes.findIndex(id => id.toString() === userId);
    
    if (dislikeIndex > -1) {
      // Already disliked, so undislike
      comment.dislikes.splice(dislikeIndex, 1);
    } else {
      // Not disliked, so dislike
      comment.dislikes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      message: dislikeIndex > -1 ? 'Dislike removed' : 'Comment disliked',
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      isLiked: false,
      isDisliked: dislikeIndex === -1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dislike comment',
      error: error.message
    });
  }
};