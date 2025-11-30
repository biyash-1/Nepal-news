// jobs/trendingCronJob.js
  const cron = require('node-cron');
const Article = require('../models/Article');
const { getTrendingConfig } = require('../config/trendingConfig');

/**
 * Cron job to update trending status for all articles
 * Runs every hour by default
 */
const startTrendingCronJob = () => {
  // Run every hour (can be adjusted)
  cron.schedule('0 * * * *', async () => {
    console.log('🔥 Running trending calculation cron job...');
    
    try {
      const config = getTrendingConfig();
      const articles = await Article.find({});
      
      let trendingCount = 0;
      let updatedCount = 0;
      
      for (const article of articles) {
        const wasTrending = article.isTrending;
        await article.updateTrendingStatus(config);
        
        if (article.isTrending) {
          trendingCount++;
        }
        
        if (wasTrending !== article.isTrending) {
          updatedCount++;
        }
      }
      
      console.log(`✅ Trending cron completed: ${trendingCount} trending articles, ${updatedCount} status changes`);
    } catch (error) {
      console.error('❌ Trending cron job failed:', error);
    }
  });
  
  console.log('📅 Trending cron job scheduled (runs every hour)');
};

/**
 * Cleanup old view data from all articles
 * Runs daily at 2 AM
 */
const startCleanupCronJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Running view data cleanup cron job...');
    
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const result = await Article.updateMany(
        {},
        {
          $pull: {
            recentViews: { timestamp: { $lt: sevenDaysAgo } }
          }
        }
      );
      
      console.log(`✅ Cleanup completed: ${result.modifiedCount} articles cleaned`);
    } catch (error) {
      console.error('❌ Cleanup cron job failed:', error);
    }
  });
  
  console.log('📅 Cleanup cron job scheduled (runs daily at 2 AM)');
};

module.exports = {
  startTrendingCronJob,
  startCleanupCronJob
};