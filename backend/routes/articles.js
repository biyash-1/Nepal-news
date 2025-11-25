const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate } = require('../middleware/auth');

// Public routes

router.get('/search', articleController.searchArticles);
router.get('/multiple-categories', articleController.getArticlesByMultipleCategories);
router.get('/category/:category', articleController.getArticlesByCategory);
router.get('/:id', articleController.getArticleById);
router.get('/', articleController.getAllArticles);


// Protected routes (require authentication)
router.post('/', authenticate, articleController.createArticle);
router.put('/:id', authenticate, articleController.updateArticle);
router.delete('/:id', authenticate, articleController.deleteArticle);

module.exports = router;