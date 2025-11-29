const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate } = require('../middleware/auth');

// Public routes

router.get('/', articleController.getAllArticles);
router.get('/search', articleController.searchArticles);
router.get('/trending', articleController.getTrendingArticles);
router.get('/trending-config', articleController.getTrendingConfigEndpoint);
router.get('/multiple-categories', articleController.getArticlesByMultipleCategories);
router.get('/category/:category', articleController.getArticlesByCategory);
router.get('/:id', articleController.getArticleById);

// View tracking (no auth required, but could be rate-limited)
router.post('/:id/view', articleController.incrementView);
// Protected routes (require authentication)
router.post('/', authenticate, articleController.createArticle);
router.put('/:id', authenticate, articleController.updateArticle);
router.delete('/:id', authenticate, articleController.deleteArticle);

// Admin routes
router.put('/admin/trending-config', authenticate, articleController.updateTrendingConfig);
router.post('/admin/recalculate-trending', authenticate, articleController.recalculateTrending);

module.exports = router;