const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

// Get comments for an article (public)
router.get('/article/:articleId', commentController.getCommentsByArticle);

// Create comment (authenticated)
router.post('/article/:articleId', authenticate, commentController.createComment);

// Update comment (authenticated)
router.put('/:commentId', authenticate, commentController.updateComment);

// Delete comment (authenticated)
router.delete('/:commentId', authenticate, commentController.deleteComment);

// Like comment (authenticated)
router.post('/:commentId/like', authenticate, commentController.likeComment);

// Dislike comment (authenticated)
router.post('/:commentId/dislike', authenticate, commentController.dislikeComment);

module.exports = router;