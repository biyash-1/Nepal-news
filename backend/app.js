// app.js - MySQL Version
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/commentRoutes');

const { 
  startTrendingScoreCronJob, 
  startPopularScoreCronJob, 
  startCleanupCronJob,
  runInitialScoreCalculation 
} = require('./jobs/trendingCronJob');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ============================
// ROUTES
// ============================
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: 'MySQL'
  });
});

// ============================
// ERROR HANDLING
// ============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// ============================
// CONNECT TO MYSQL & START CRON JOBS
// ============================
connectDB()
  .then(async () => {
    console.log('✅ MySQL connected');

    // Run initial score calculation on startup
    await runInitialScoreCalculation();

    // Start cron jobs
    startTrendingScoreCronJob();  // every 15 min
    startPopularScoreCronJob();   // every 6 hours
    startCleanupCronJob();        // daily at 3 AM

    console.log('🚀 All cron jobs initialized');
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  });

module.exports = app;