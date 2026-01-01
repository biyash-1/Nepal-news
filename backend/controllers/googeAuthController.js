const { OAuth2Client } = require("google-auth-library");
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { pool } = require('../config/db');

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Redirect to Google OAuth
exports.googleAuth = (req, res) => {
  const redirectUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
  res.redirect(redirectUrl);
};

// Handle callback from Google
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { email, name, picture, id: googleId } = userInfoResponse.data;

    // Check if user exists
    let user = await User.findByEmail(email);
    
    if (!user) {
      // Create new user
      const userId = await User.create({
        username: name,
        email,
        googleId,
        provider: 'google',
        password: null
      });

      // Update avatar if provided
      if (picture) {
        await pool.execute('UPDATE users SET avatar = ? WHERE id = ?', [picture, userId]);
      }
      
      user = await User.findById(userId);
    } else if (!user.google_id) {
      // Link existing account with Google
      const updates = ['google_id = ?'];
      const params = [googleId];
      
      if (picture) {
        updates.push('avatar = ?');
        params.push(picture);
      }
      
      params.push(user.id);
      await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`, 
        params
      );
      
      // Refresh user data
      user = await User.findById(user.id);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // Redirect to frontend 
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error("Google auth failed:", error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=failed`);
  }
};