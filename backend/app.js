const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articles');

require('dotenv').config();

const cors = require('cors');

const app = express();

// Middleware
app.use(express.json())
app.use(cookieParser());;
app.use(express.urlencoded({ extended: true }));
app.use('/api/articles', articleRoutes);
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,               // if you use cookies
}));
// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

module.exports = app; //