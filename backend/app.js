// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articles'); // updated file name
const commentRoutes = require('./routes/commentRoutes');

const { 
  startTrendingScoreCronJob, 
  startPopularScoreCronJob, 
  startCleanupCronJob,
  runInitialScoreCalculation 
} = require('./jobs/trendingCronJob');

const app = express();

// ============================
// MIDDLEWARE
// ============================
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
    database: 'MongoDB Atlas'
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
// CONNECT TO MONGODB & START CRON JOBS
// ============================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected');

  // Run initial score calculation on startup
  await runInitialScoreCalculation();

  // Start cron jobs
  startTrendingScoreCronJob();  // every 15 min
  startPopularScoreCronJob();   // every 6 hours
  startCleanupCronJob();        // daily at 3 AM

  console.log('🚀 All cron jobs initialized');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

module.exports = app;
