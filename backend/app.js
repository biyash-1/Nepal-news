// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/commentRoutes');

const { startTrendingCronJob, startCleanupCronJob } = require('./jobs/trendingCronJob');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to DB and start cron jobs
connectDB().then(() => {
  if (process.env.NODE_APP_INSTANCE === '0' || !process.env.NODE_APP_INSTANCE) {
   startTrendingCronJob();
   startCleanupCronJob();
}
});

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: 'MongoDB Atlas'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

module.exports = app;
