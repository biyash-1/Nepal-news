// scripts/migrate-to-dynamic-trending.js
// Run this once to migrate from old system to new dynamic trending system

const mongoose = require('mongoose');
const Article = require('./models/Article');
const ViewLog = require('./models/ViewLog');
require('dotenv').config();

async function migrateToDynamicTrending() {
  try {
    console.log('🔄 Starting migration to dynamic trending system...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Step 1: Remove old fields from all articles
    console.log('📝 Removing deprecated fields (isTrending, recentViews, lastTrendingCheck)...');
    await Article.updateMany(
      {},
      { 
        $unset: { 
          isTrending: "",
          recentViews: "",
          lastTrendingCheck: ""
        }
      }
    );
    console.log('✅ Deprecated fields removed');

    // Step 2: Initialize new fields with defaults
    console.log('📝 Initializing new rolling view fields and scores...');
    await Article.updateMany(
      {},
      { 
        $set: { 
          viewsLast24h: 0,
          viewsLast7d: 0,
          trendingScore: 0,
          popularScore: 0,
          lastScoreUpdate: new Date()
        }
      }
    );
    console.log('✅ New fields initialized');

    // Step 3: Update each article with random views and scores
    console.log('🔢 Updating articles with random view counts and scores...');

    const articles = await Article.find({});
    let updated = 0;

    for (const article of articles) {
      // Randomized view counts
      const random24h = Math.floor(Math.random() * 30);   // 0–499 views in last 24h
      const random7d = Math.floor(Math.random() * 100);  // 0–1999 views in last 7 days
      const randomTotal = Math.floor(Math.random() * 500); // 0–9999 total views (if you have this field)

      article.viewsLast24h = random24h;
      article.viewsLast7d = random7d;
      article.views = randomTotal; // optional, if total views field exists
      article.trendingScore = article.calculateTrendingScore();
      article.popularScore = article.calculatePopularScore();
      article.lastScoreUpdate = new Date();

      await article.save({ validateBeforeSave: false });
      updated++;

      if (updated % 100 === 0) {
        console.log(`   Progress: ${updated}/${articles.length} articles processed...`);
      }
    }

    console.log(`✅ Updated ${updated} articles with random views and scores`);

    // Step 4: Update ViewLog expiration times to 7 days
    console.log('⏰ Updating ViewLog expiration times to 7 days...');
    const viewLogs = await ViewLog.find({});
    for (const log of viewLogs) {
      log.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await log.save({ validateBeforeSave: false });
    }
    console.log('✅ ViewLog expiration times updated');

    // Step 5: Remove old "trending" tags
    console.log('🏷️  Removing old trending tags...');
    await Article.updateMany(
      { tags: 'ट्रेन्डिङ' },
      { $pull: { tags: 'ट्रेन्डिङ' } }
    );
    console.log('✅ Old trending tags removed');

    // Migration complete
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`  - Total articles processed: ${articles.length}`);
    console.log('\nNext steps:');
    console.log('  1. Deploy the updated code with new cron jobs');
    console.log('  2. The system will now automatically update scores:');
    console.log('     - Every 15 minutes for trending (24h)');
    console.log('     - Every 6 hours for popular (7d)');
    console.log('  3. Monitor logs for cron job execution');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run migration
migrateToDynamicTrending();
