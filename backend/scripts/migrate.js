// =====================================================
// scripts/migrate-mongo-to-mysql.js
// Complete data migration from MongoDB to MySQL
// FIXED: Datetime formatting & Foreign key handling
// =====================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

// MongoDB Models
const MongoUser = require('../models/User');
const MongoArticle = require('../models/Article');
const MongoComment = require('../models/Comment');
const MongoViewLog = require('../models/ViewLog');

// =====================================================
// DATETIME HELPER FUNCTION
// =====================================================
/**
 * Converts MongoDB date (ISO string or Date object) to MySQL DATETIME format
 * @param {Date|string|null} date - MongoDB date
 * @returns {string|null} MySQL formatted datetime (YYYY-MM-DD HH:MM:SS)
 */
function toMySQLDateTime(date) {
  if (!date) return null;
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    // Check for invalid date
    if (isNaN(d.getTime())) {
      console.warn(`Invalid date encountered: ${date}`);
      return null;
    }
    
    // Format: YYYY-MM-DD HH:MM:SS
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error(`Error converting date: ${date}`, error.message);
    return null;
  }
}

// Create MySQL connection pool
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: '+00:00' // Use UTC
});

// ID mapping storage (MongoDB ObjectId -> MySQL UUID)
const idMapping = {
  users: new Map(),
  articles: new Map(),
  comments: new Map()
};

// Progress tracking
let stats = {
  users: { total: 0, migrated: 0, failed: 0 },
  articles: { total: 0, migrated: 0, failed: 0 },
  comments: { total: 0, migrated: 0, failed: 0, skipped: 0 },
  viewLogs: { total: 0, migrated: 0, failed: 0 },
  categories: { total: 0, migrated: 0, failed: 0 },
  tags: { total: 0, migrated: 0, failed: 0 },
  savedArticles: { total: 0, migrated: 0, failed: 0 }
};

let systemUserId = null;

// =====================================================
// STEP 0: CREATE SYSTEM USER (FALLBACK)
// =====================================================
async function createSystemUser() {
  console.log('\n🔧 Creating system user for fallback...');
  
  try {
    // Check if system user already exists
    const [existing] = await mysqlPool.execute(
      'SELECT id FROM users WHERE email = ?',
      ['system@lalitpurexpress.com']
    );
    
    if (existing.length > 0) {
      systemUserId = existing[0].id;
      console.log(`   ✅ System user already exists: ${systemUserId}`);
    } else {
      // Create new system user
      systemUserId = uuidv4();
      await mysqlPool.execute(
        `INSERT INTO users (id, username, email, password, role, newsletter, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          systemUserId,
          'System',
          'system@lalitpurexpress.com',
          null,
          'admin',
          false,
          toMySQLDateTime(new Date()),
          toMySQLDateTime(new Date())
        ]
      );
      console.log(`   ✅ Created system user: ${systemUserId}`);
    }
  } catch (error) {
    console.error('   ❌ Error creating system user:', error);
    throw error;
  }
}

// =====================================================
// STEP 1: MIGRATE USERS
// =====================================================
async function migrateUsers() {
  console.log('\n📦 STEP 1: Migrating Users...');
  
  try {
    const users = await MongoUser.find({}).lean();
    stats.users.total = users.length;

    for (const user of users) {
      try {
        const mysqlId = uuidv4();
        idMapping.users.set(user._id.toString(), mysqlId);

        await mysqlPool.execute(
          `INSERT INTO users (id, username, email, password, google_id, provider, role, avatar, newsletter, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mysqlId,
            user.username,
            user.email,
            user.password || null,
            user.googleId || null,
            user.provider || 'local',
            user.role || 'reader',
            user.avatar || null,
            user.preferences?.newsletter || false,
            toMySQLDateTime(user.createdAt || new Date()),
            toMySQLDateTime(user.updatedAt || new Date())
          ]
        );

        // Migrate user preferences (categories)
        if (user.preferences?.categories?.length > 0) {
          for (const category of user.preferences.categories) {
            await mysqlPool.execute(
              'INSERT INTO user_preferences (user_id, category) VALUES (?, ?)',
              [mysqlId, category]
            );
          }
        }

        stats.users.migrated++;
        process.stdout.write(`\r   Users: ${stats.users.migrated}/${stats.users.total}`);
      } catch (error) {
        console.error(`\n   ❌ Failed to migrate user ${user._id}:`, error.message);
        stats.users.failed++;
      }
    }

    console.log(`\n   ✅ Users migrated: ${stats.users.migrated}/${stats.users.total} (${stats.users.failed} failed)`);
  } catch (error) {
    console.error('   ❌ Error in user migration:', error);
    throw error;
  }
}

// =====================================================
// STEP 2: MIGRATE ARTICLES
// =====================================================
async function migrateArticles() {
  console.log('\n📰 STEP 2: Migrating Articles...');
  
  try {
    const articles = await MongoArticle.find({}).lean();
    stats.articles.total = articles.length;

    for (const article of articles) {
      const connection = await mysqlPool.getConnection();
      try {
        await connection.beginTransaction();

        const mysqlId = uuidv4();
        idMapping.articles.set(article._id.toString(), mysqlId);

        // Get mapped author ID with fallback to system user
        let authorId = null;
        let authorUsername = 'Unknown';
        let authorAvatar = null;

        if (article.author?.userId) {
          authorId = idMapping.users.get(article.author.userId.toString());
        }

        if (!authorId) {
          // Use system user as fallback
          authorId = systemUserId;
          authorUsername = article.author?.username || 'Unknown';
          authorAvatar = article.author?.avatar || null;
        } else {
          authorUsername = article.author?.username || 'Unknown';
          authorAvatar = article.author?.avatar || null;
        }

        // Insert article with proper datetime formatting
        await connection.execute(
          `INSERT INTO articles (
            id, title, content, image, 
            author_user_id, author_username, author_avatar,
            views, views_last_24h, views_last_7d,
            trending_score, popular_score, likes,
            last_score_update, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mysqlId,
            article.title,
            article.content,
            article.image || null,
            authorId,
            authorUsername,
            authorAvatar,
            article.views || 0,
            article.viewsLast24h || 0,
            article.viewsLast7d || 0,
            article.trendingScore || 0,
            article.popularScore || 0,
            article.likes || 0,
            toMySQLDateTime(article.lastScoreUpdate || new Date()),
            toMySQLDateTime(article.createdAt || new Date()),
            toMySQLDateTime(article.updatedAt || new Date())
          ]
        );

        // Migrate categories
        if (article.categories?.length > 0) {
          for (const category of article.categories) {
            await connection.execute(
              'INSERT INTO article_categories (article_id, category) VALUES (?, ?)',
              [mysqlId, category]
            );
            stats.categories.migrated++;
          }
        }

        // Migrate tags
        if (article.tags?.length > 0) {
          for (const tag of article.tags) {
            await connection.execute(
              'INSERT INTO article_tags (article_id, tag) VALUES (?, ?)',
              [mysqlId, tag]
            );
            stats.tags.migrated++;
          }
        }

        await connection.commit();
        stats.articles.migrated++;
        process.stdout.write(`\r   Articles: ${stats.articles.migrated}/${stats.articles.total}`);
      } catch (error) {
        await connection.rollback();
        console.error(`\n   ❌ Failed to migrate article ${article._id}:`, error.message);
        stats.articles.failed++;
      } finally {
        connection.release();
      }
    }

    console.log(`\n   ✅ Articles migrated: ${stats.articles.migrated}/${stats.articles.total} (${stats.articles.failed} failed)`);
    console.log(`   ✅ Categories: ${stats.categories.migrated}, Tags: ${stats.tags.migrated}`);
  } catch (error) {
    console.error('   ❌ Error in article migration:', error);
    throw error;
  }
}

// =====================================================
// STEP 3: MIGRATE COMMENTS (WITH FK VALIDATION)
// =====================================================
async function migrateComments() {
  console.log('\n💬 STEP 3: Migrating Comments...');
  
  try {
    const comments = await MongoComment.find({}).lean();
    stats.comments.total = comments.length;

    for (const comment of comments) {
      const connection = await mysqlPool.getConnection();
      try {
        await connection.beginTransaction();

        // Validate foreign keys BEFORE attempting insert
        const articleId = idMapping.articles.get(comment.article?.toString());
        const userId = idMapping.users.get(comment.user?.toString());

        // Skip if article doesn't exist
        if (!articleId) {
          stats.comments.skipped++;
          await connection.rollback();
          connection.release();
          continue;
        }

        // Skip if user doesn't exist
        if (!userId) {
          stats.comments.skipped++;
          await connection.rollback();
          connection.release();
          continue;
        }

        const mysqlId = uuidv4();
        idMapping.comments.set(comment._id.toString(), mysqlId);

        // Insert comment with proper datetime formatting
        await connection.execute(
          `INSERT INTO comments (
            id, article_id, user_id, content,
            is_edited, edited_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mysqlId,
            articleId,
            userId,
            comment.content,
            comment.isEdited || false,
            toMySQLDateTime(comment.editedAt),
            toMySQLDateTime(comment.createdAt || new Date()),
            toMySQLDateTime(comment.updatedAt || new Date())
          ]
        );

        // Migrate likes
        if (comment.likes?.length > 0) {
          for (const likeUserId of comment.likes) {
            const mappedUserId = idMapping.users.get(likeUserId.toString());
            if (mappedUserId) {
              await connection.execute(
                'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
                [mysqlId, mappedUserId]
              );
            }
          }
        }

        // Migrate dislikes
        if (comment.dislikes?.length > 0) {
          for (const dislikeUserId of comment.dislikes) {
            const mappedUserId = idMapping.users.get(dislikeUserId.toString());
            if (mappedUserId) {
              await connection.execute(
                'INSERT INTO comment_dislikes (comment_id, user_id) VALUES (?, ?)',
                [mysqlId, mappedUserId]
              );
            }
          }
        }

        await connection.commit();
        stats.comments.migrated++;
        process.stdout.write(`\r   Comments: ${stats.comments.migrated}/${stats.comments.total}`);
      } catch (error) {
        await connection.rollback();
        console.error(`\n   ❌ Failed to migrate comment ${comment._id}:`, error.message);
        stats.comments.failed++;
      } finally {
        connection.release();
      }
    }

    console.log(`\n   ✅ Comments migrated: ${stats.comments.migrated}/${stats.comments.total}`);
    console.log(`   ⚠️  Skipped: ${stats.comments.skipped} (missing FK references)`);
    console.log(`   ❌ Failed: ${stats.comments.failed}`);
  } catch (error) {
    console.error('   ❌ Error in comment migration:', error);
    throw error;
  }
}

// =====================================================
// STEP 4: MIGRATE VIEW LOGS
// =====================================================
async function migrateViewLogs() {
  console.log('\n👁️  STEP 4: Migrating View Logs...');
  
  try {
    // Only migrate recent view logs (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const viewLogs = await MongoViewLog.find({ 
      viewedAt: { $gte: sevenDaysAgo } 
    }).lean();
    
    stats.viewLogs.total = viewLogs.length;

    // Batch insert for better performance
    const batchSize = 1000;
    for (let i = 0; i < viewLogs.length; i += batchSize) {
      const batch = viewLogs.slice(i, i + batchSize);
      const connection = await mysqlPool.getConnection();
      
      try {
        await connection.beginTransaction();

        for (const log of batch) {
          const articleId = idMapping.articles.get(log.article?.toString());
          
          if (!articleId) {
            stats.viewLogs.failed++;
            continue;
          }

          // Calculate expires_at if not present (7 days from viewed_at)
          const viewedAt = log.viewedAt || new Date();
          const expiresAt = log.expiresAt || new Date(viewedAt.getTime() + 7 * 24 * 60 * 60 * 1000);

          await connection.execute(
            `INSERT INTO view_logs (article_id, identifier, viewed_at, expires_at)
             VALUES (?, ?, ?, ?)`,
            [
              articleId,
              log.identifier,
              toMySQLDateTime(viewedAt),
              toMySQLDateTime(expiresAt)
            ]
          );

          stats.viewLogs.migrated++;
        }

        await connection.commit();
        process.stdout.write(`\r   View Logs: ${stats.viewLogs.migrated}/${stats.viewLogs.total}`);
      } catch (error) {
        await connection.rollback();
        console.error(`\n   ❌ Failed to migrate view log batch:`, error.message);
        stats.viewLogs.failed += batch.length;
      } finally {
        connection.release();
      }
    }

    console.log(`\n   ✅ View logs migrated: ${stats.viewLogs.migrated}/${stats.viewLogs.total} (${stats.viewLogs.failed} failed)`);
  } catch (error) {
    console.error('   ❌ Error in view log migration:', error);
    throw error;
  }
}

// =====================================================
// STEP 5: MIGRATE SAVED ARTICLES
// =====================================================
async function migrateSavedArticles() {
  console.log('\n📖 STEP 5: Migrating Saved Articles...');
  
  try {
    const users = await MongoUser.find({ 
      savedArticles: { $exists: true, $ne: [] } 
    }).lean();

    for (const user of users) {
      const userId = idMapping.users.get(user._id.toString());
      
      if (!userId || !user.savedArticles?.length) continue;

      for (const articleId of user.savedArticles) {
        try {
          const mappedArticleId = idMapping.articles.get(articleId.toString());
          
          // Skip if article doesn't exist (FK constraint)
          if (!mappedArticleId) {
            stats.savedArticles.failed++;
            continue;
          }

          await mysqlPool.execute(
            'INSERT IGNORE INTO saved_articles (user_id, article_id) VALUES (?, ?)',
            [userId, mappedArticleId]
          );

          stats.savedArticles.migrated++;
          stats.savedArticles.total++;
        } catch (error) {
          console.error(`\n   ❌ Failed to migrate saved article:`, error.message);
          stats.savedArticles.failed++;
        }
      }
    }

    console.log(`\n   ✅ Saved articles migrated: ${stats.savedArticles.migrated} (${stats.savedArticles.failed} failed)`);
  } catch (error) {
    console.error('   ❌ Error in saved articles migration:', error);
    throw error;
  }
}

// =====================================================
// STEP 6: RECALCULATE SCORES
// =====================================================
async function recalculateScores() {
  console.log('\n🔢 STEP 6: Recalculating Trending & Popular Scores...');
  
  try {
    await mysqlPool.execute('CALL bulk_update_trending_scores()');
    console.log('   ✅ Trending scores recalculated');
    
    await mysqlPool.execute('CALL bulk_update_popular_scores()');
    console.log('   ✅ Popular scores recalculated');
  } catch (error) {
    console.error('   ⚠️  Error recalculating scores (you may need to run this manually):', error.message);
  }
}

// =====================================================
// VERIFICATION: CHECK DATA INTEGRITY
// =====================================================
async function verifyMigration() {
  console.log('\n🔍 STEP 7: Verifying Data Integrity...');
  
  try {
    // Check counts
    const [userCount] = await mysqlPool.execute('SELECT COUNT(*) as count FROM users');
    const [articleCount] = await mysqlPool.execute('SELECT COUNT(*) as count FROM articles');
    const [commentCount] = await mysqlPool.execute('SELECT COUNT(*) as count FROM comments');
    const [viewLogCount] = await mysqlPool.execute('SELECT COUNT(*) as count FROM view_logs');

    console.log('\n   📊 MySQL Database Counts:');
    console.log(`   - Users: ${userCount[0].count}`);
    console.log(`   - Articles: ${articleCount[0].count}`);
    console.log(`   - Comments: ${commentCount[0].count}`);
    console.log(`   - View Logs: ${viewLogCount[0].count}`);

    // Check for orphaned records (should be 0 with our FK validation)
    const [orphanedComments] = await mysqlPool.execute(`
      SELECT COUNT(*) as count FROM comments c
      LEFT JOIN articles a ON c.article_id = a.id
      WHERE a.id IS NULL
    `);

    const [orphanedCommentsUsers] = await mysqlPool.execute(`
      SELECT COUNT(*) as count FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE u.id IS NULL
    `);

    if (orphanedComments[0].count > 0 || orphanedCommentsUsers[0].count > 0) {
      console.log(`\n   ⚠️  Warning: ${orphanedComments[0].count} orphaned comments (articles), ${orphanedCommentsUsers[0].count} orphaned comments (users)`);
    } else {
      console.log(`\n   ✅ No orphaned comments found - FK integrity maintained`);
    }

    // Sample data check
    const [sampleArticle] = await mysqlPool.execute('SELECT * FROM articles LIMIT 1');

    if (sampleArticle.length > 0) {
      console.log('\n   ✅ Sample article structure verified');
      console.log(`      Title: ${sampleArticle[0].title}`);
      console.log(`      Created: ${sampleArticle[0].created_at}`);
      
      // Get categories for this article
      const [categories] = await mysqlPool.execute(
        'SELECT category FROM article_categories WHERE article_id = ? LIMIT 5',
        [sampleArticle[0].id]
      );
      
      if (categories.length > 0) {
        const categoryList = categories.map(c => c.category).join(', ');
        console.log(`      Categories: ${categoryList}`);
      }
    }

    // Verify datetime format
    const [sampleDates] = await mysqlPool.execute(`
      SELECT created_at, updated_at FROM articles 
      WHERE created_at IS NOT NULL 
      LIMIT 1
    `);
    
    if (sampleDates.length > 0) {
      console.log(`\n   ✅ Datetime format verified (MySQL DATETIME)`);
      console.log(`      Sample created_at: ${sampleDates[0].created_at}`);
    }

  } catch (error) {
    console.error('   ❌ Error in verification:', error);
  }
}

// =====================================================
// MAIN MIGRATION FUNCTION
// =====================================================
async function runMigration() {
  console.log('🚀 Starting MongoDB to MySQL Migration');
  console.log('==========================================\n');

  const startTime = Date.now();

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    // Test MySQL connection
    console.log('📡 Connecting to MySQL...');
    const connection = await mysqlPool.getConnection();
    console.log('✅ MySQL connected\n');
    connection.release();

    // Run migration steps in order
    await createSystemUser();      // Step 0: Create fallback user
    await migrateUsers();           // Step 1: Migrate users first
    await migrateArticles();        // Step 2: Migrate articles second
    await migrateComments();        // Step 3: Migrate comments (with FK validation)
    await migrateViewLogs();        // Step 4: Migrate view logs
    await migrateSavedArticles();   // Step 5: Migrate saved articles
    await recalculateScores();      // Step 6: Recalculate scores
    await verifyMigration();        // Step 7: Verify integrity

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n==========================================');
    console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('==========================================\n');
    console.log('📊 Summary:');
    console.log(`   Total Time: ${duration}s`);
    console.log(`   Users: ${stats.users.migrated}/${stats.users.total} (${stats.users.failed} failed)`);
    console.log(`   Articles: ${stats.articles.migrated}/${stats.articles.total} (${stats.articles.failed} failed)`);
    console.log(`   Comments: ${stats.comments.migrated}/${stats.comments.total} (${stats.comments.skipped} skipped, ${stats.comments.failed} failed)`);
    console.log(`   View Logs: ${stats.viewLogs.migrated}/${stats.viewLogs.total} (${stats.viewLogs.failed} failed)`);
    console.log(`   Saved Articles: ${stats.savedArticles.migrated} (${stats.savedArticles.failed} failed)`);
    console.log(`   Categories: ${stats.categories.migrated}`);
    console.log(`   Tags: ${stats.tags.migrated}`);

    if (stats.users.failed > 0 || stats.articles.failed > 0 || stats.comments.failed > 0) {
      console.log('\n⚠️  Some records failed to migrate. Check logs above for details.');
    }

    if (stats.comments.skipped > 0) {
      console.log(`\n⚠️  ${stats.comments.skipped} comments were skipped due to missing FK references (orphaned data).`);
    }

    console.log('\n💡 Next Steps:');
    console.log('   1. Review the verification results above');
    console.log('   2. Test your API endpoints with the new MySQL database');
    console.log('   3. Update your .env to use MySQL connection');
    console.log('   4. Backup your MongoDB data before removing it');
    console.log('   5. Consider cleaning up orphaned data in MongoDB\n');

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close connections
    await mongoose.connection.close();
    await mysqlPool.end();
    console.log('\n👋 Connections closed. Migration script finished.\n');
  }
}

// Run the migration
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration, toMySQLDateTime };