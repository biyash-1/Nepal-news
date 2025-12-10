// jobs/trendingCronJob.js
const cron = require('node-cron');
const Article = require('../models/Article');
const ViewLog = require('../models/ViewLog');

/**
 * Cron job to update trending scores (24h rolling window)
 * Runs every 15 minutes
 */
const startTrendingScoreCronJob = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('🔥 Running trending score update (24h window)...');
    
    try {
      const result = await Article.bulkUpdateScores('24h');
      
      console.log(`✅ Trending scores updated: ${result.updated} articles processed`);
    } catch (error) {
      console.error('❌ Trending score update failed:', error);
    }
  });
  
  console.log('📅 Trending score cron job scheduled (runs every 15 minutes)');
};

/**
 * Cron job to update popular scores (7d rolling window)
 * Runs every 6 hours
 */
const startPopularScoreCronJob = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('📊 Running popular score update (7d window)...');
    
    try {
      const result = await Article.bulkUpdateScores('7d');
      
      console.log(`✅ Popular scores updated: ${result.updated} articles processed`);
    } catch (error) {
      console.error('❌ Popular score update failed:', error);
    }
  });
  
  console.log('📅 Popular score cron job scheduled (runs every 6 hours)');
};

/**
 * Cleanup old view data from ViewLog
 * Runs daily at 3 AM (MongoDB TTL will handle most, this is backup)
 */
const startCleanupCronJob = () => {
  cron.schedule('0 3 * * *', async () => {
    console.log('🧹 Running view log cleanup cron job...');
    
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const result = await ViewLog.deleteMany({
        viewedAt: { $lt: sevenDaysAgo }
      });
      
      console.log(`✅ Cleanup completed: ${result.deletedCount} old view logs removed`);
    } catch (error) {
      console.error('❌ Cleanup cron job failed:', error);
    }
  });
  
  console.log('📅 Cleanup cron job scheduled (runs daily at 3 AM)');
};

/**
 * Optional: Initial score calculation on startup
 * Useful when deploying or after data migration
 */
const runInitialScoreCalculation = async () => {
  console.log('🚀 Running initial score calculation...');
  
  try {
    // Update both 24h and 7d scores
    await Article.bulkUpdateScores('24h');
    await Article.bulkUpdateScores('7d');
    
    console.log('✅ Initial score calculation completed');
  } catch (error) {
    console.error('❌ Initial score calculation failed:', error);
  }
};

module.exports = {
  startTrendingScoreCronJob,
  startPopularScoreCronJob,
  startCleanupCronJob,
  runInitialScoreCalculation
};