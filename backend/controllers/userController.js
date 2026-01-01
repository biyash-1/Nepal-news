const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { pool } = require('../config/db');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId, role: 'reader' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        email,
        role: 'reader'
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get saved articles
    const savedArticles = await User.getSavedArticles(req.user.userId);

    // Remove password from response
    delete user.password;

    res.json({ 
      success: true, 
      user: {
        ...user,
        savedArticles
      }
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, preferences } = req.body;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update basic user info
      if (username) {
        await connection.execute('UPDATE users SET username = ? WHERE id = ?', [username, req.user.userId]);
      }

      // Update newsletter preference
      if (preferences && preferences.newsletter !== undefined) {
        await connection.execute('UPDATE users SET newsletter = ? WHERE id = ?', [preferences.newsletter, req.user.userId]);
      }

      // Update category preferences
      if (preferences && preferences.categories) {
        // Delete existing preferences
        await connection.execute('DELETE FROM user_preferences WHERE user_id = ?', [req.user.userId]);
        
        // Insert new preferences
        if (preferences.categories.length > 0) {
          const values = preferences.categories.map(cat => [req.user.userId, cat]);
          await connection.query('INSERT INTO user_preferences (user_id, category) VALUES ?', [values]);
        }
      }

      await connection.commit();

      // Get updated user
      const user = await User.findById(req.user.userId);
      delete user.password;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Update failed', 
      error: error.message 
    });
  }
};

// Save article to user's collection
exports.saveArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    
    // Check if already saved
    const [existing] = await pool.execute(
      'SELECT id FROM saved_articles WHERE user_id = ? AND article_id = ?',
      [req.user.userId, articleId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Article already saved' 
      });
    }

    await User.saveArticle(req.user.userId, articleId);

    res.json({
      success: true,
      message: 'Article saved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save article', 
      error: error.message 
    });
  }
};

// Remove article from saved collection
exports.unsaveArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    
    await pool.execute(
      'DELETE FROM saved_articles WHERE user_id = ? AND article_id = ?',
      [req.user.userId, articleId]
    );

    res.json({
      success: true,
      message: 'Article removed from saved'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove article', 
      error: error.message 
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};