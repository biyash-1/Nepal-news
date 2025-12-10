const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate} = require('../middleware/auth');

// ============================
// PUBLIC ROUTES
// ============================

// Get all articles (with pagination & filters)
router.get('/', articleController.getAllArticles);

// Get single article by ID
router.get('/:id', articleController.getArticleById);

// Increment view count for an article
router.post('/:id/view', articleController.incrementView);

// Search articles
router.get('/search', articleController.searchArticles);

// Get articles by category
router.get('/category/:category', articleController.getArticlesByCategory);

// Get articles by multiple categories
router.get('/categories/multiple', articleController.getArticlesByMultipleCategories);

// ============================
// NEWS SECTIONS
// ============================

// Get latest headlines (limit 3)
router.get('/news/headlines', articleController.getHeadlines);

// Get other news (exclude specific IDs)
router.get('/news/other', articleController.getOtherNews);

// Get trending news (based on trendingScore, last 24 hours)
router.get('/news/trending', articleController.getTrendingNews);

// Get popular news (based on views, last 7 days)
router.get('/news/popular', articleController.getPopularNews);

// ============================
// PROTECTED ROUTES
// ============================

// Create article
router.post('/', authenticate, articleController.createArticle);

// Update article
router.put('/:id', authenticate, articleController.updateArticle);

// Delete article
router.delete('/:id', authenticate, articleController.deleteArticle);

// ============================
// ADMIN ROUTES
// ============================

// Manually trigger score recalculation
router.post('/admin/recalculate-scores', authenticate, articleController.recalculateScores);

module.exports = router;
