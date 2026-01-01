const cron = require('node-cron');
const { Article } = require('../models');
const { pool } = require('../config/db');

// Run initial score calculation on startup
const runInitialScoreCalculation = async () => {
  try {
    console.log('🔄 Running initial score calculation...');
    
    await pool.execute('CALL bulk_update_trending_scores()');
    await pool.execute('CALL bulk_update_popular_scores()');
    
    console.log('✅ Initial scores calculated');
  } catch (error) {
    console.error('❌ Error in initial score calculation:', error);
  }
};

// Update trending scores every 15 minutes
const startTrendingScoreCronJob = () => {
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('🔄 Updating trending scores...');
      await pool.execute('CALL bulk_update_trending_scores()');
      console.log('✅ Trending scores updated');
    } catch (error) {
      console.error('❌ Error updating trending scores:', error);
    }
  });
  console.log('📅 Trending score cron job started (every 15 min)');
};

// Update popular scores every 6 hours
const startPopularScoreCronJob = () => {
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('🔄 Updating popular scores...');
      await pool.execute('CALL bulk_update_popular_scores()');
      console.log('✅ Popular scores updated');
    } catch (error) {
      console.error('❌ Error updating popular scores:', error);
    }
  });
  console.log('📅 Popular score cron job started (every 6 hours)');
};

// Cleanup expired view logs daily at 3 AM
const startCleanupCronJob = () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      console.log('🧹 Cleaning up expired view logs...');
      await pool.execute('CALL cleanup_expired_views()');
      console.log('✅ View logs cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up view logs:', error);
    }
  });
  console.log('📅 Cleanup cron job started (daily at 3 AM)');
};

module.exports = {
  runInitialScoreCalculation,
  startTrendingScoreCronJob,
  startPopularScoreCronJob,
  startCleanupCronJob
};