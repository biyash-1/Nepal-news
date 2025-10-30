const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { googleAuth, googleCallback } = require('../controllers/googeAuthController');

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/updateProfile', authenticate, userController.updateProfile);
router.post('/save-article', authenticate, userController.saveArticle);

module.exports = router;
