const { pool } = require('../config/db');
const crypto = require('crypto');

// Helper to execute queries
const query = async (sql, params = []) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

// ==================== USER MODEL ====================

const User = {
  async create({ username, email, password, googleId, provider = 'local', role = 'reader' }) {
    const sql = `
      INSERT INTO users (username, email, password, google_id, provider, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [username, email, password, googleId, provider, role]);
    return result.insertId;
  },

  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
  },

  async findById(id) {
    const sql = `
      SELECT u.*, 
        GROUP_CONCAT(DISTINCT up.category) as preference_categories
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `;
    const [rows] = await pool.execute(sql, [id]);
    if (rows[0]) {
      rows[0].preferences = {
        categories: rows[0].preference_categories ? rows[0].preference_categories.split(',') : [],
        newsletter: rows[0].newsletter
      };
      delete rows[0].preference_categories;
    }
    return rows[0];
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return;
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);
  },

  async getSavedArticles(userId) {
    const sql = `
      SELECT a.*, sa.saved_at
      FROM saved_articles sa
      JOIN articles a ON sa.article_id = a.id
      WHERE sa.user_id = ?
      ORDER BY sa.saved_at DESC
    `;
    return query(sql, [userId]);
  },

  async saveArticle(userId, articleId) {
    const sql = 'INSERT IGNORE INTO saved_articles (user_id, article_id) VALUES (?, ?)';
    await pool.execute(sql, [userId, articleId]);
  }
};

// ==================== ARTICLE MODEL ====================

const Article = {
  async create(articleData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert article
      const sql = `
        INSERT INTO articles (title, content, image, author_user_id, author_username, author_avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(sql, [
        articleData.title,
        articleData.content,
        articleData.image,
        articleData.author.userId,
        articleData.author.username,
        articleData.author.avatar
      ]);

      const articleId = result.insertId;

      // Insert categories
      if (articleData.categories && articleData.categories.length > 0) {
        const catSql = 'INSERT INTO article_categories (article_id, category) VALUES ?';
        const catValues = articleData.categories.map(cat => [articleId, cat]);
        await connection.query(catSql, [catValues]);
      }

      // Insert tags
      if (articleData.tags && articleData.tags.length > 0) {
        const tagSql = 'INSERT INTO article_tags (article_id, tag) VALUES ?';
        const tagValues = articleData.tags.map(tag => [articleId, tag]);
        await connection.query(tagSql, [tagValues]);
      }

      await connection.commit();
      return articleId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async findById(id) {
    const sql = `
      SELECT a.*,
        (SELECT JSON_ARRAYAGG(category) FROM article_categories WHERE article_id = a.id) as categories,
        (SELECT JSON_ARRAYAGG(tag) FROM article_tags WHERE article_id = a.id) as tags
      FROM articles a
      WHERE a.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    if (rows[0]) {
      rows[0].categories = JSON.parse(rows[0].categories || '[]');
      rows[0].tags = JSON.parse(rows[0].tags || '[]');
      rows[0].author = {
        userId: rows[0].author_user_id,
        username: rows[0].author_username,
        avatar: rows[0].author_avatar
      };
    }
    return rows[0];
  },

  async findAll({ page = 1, limit = 10, category = null, sortBy = 'created_at', order = 'DESC' }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT a.*,
        (SELECT JSON_ARRAYAGG(category) FROM article_categories WHERE article_id = a.id) as categories,
        (SELECT JSON_ARRAYAGG(tag) FROM article_tags WHERE article_id = a.id) as tags
      FROM articles a
    `;
    const params = [];

    if (category) {
      sql += ` WHERE EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category = ?
      )`;
      params.push(category);
    }

    sql += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.execute(sql, params);
    
    // Transform results
    rows.forEach(row => {
      row.categories = JSON.parse(row.categories || '[]');
      row.tags = JSON.parse(row.tags || '[]');
      row.author = {
        userId: row.author_user_id,
        username: row.author_username,
        avatar: row.author_avatar
      };
    });

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM articles';
    if (category) {
      countSql += ` WHERE EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = articles.id AND category = ?
      )`;
    }
    const [countRows] = await pool.execute(countSql, category ? [category] : []);
    
    return {
      articles: rows,
      total: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit),
      currentPage: page
    };
  },

  async incrementView(articleId, identifier) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if already viewed in last 24h
      const checkSql = `
        SELECT id FROM view_logs 
        WHERE article_id = ? AND identifier = ? 
        AND viewed_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `;
      const [existing] = await connection.execute(checkSql, [articleId, identifier]);

      if (existing.length > 0) {
        await connection.commit();
        return { alreadyCounted: true };
      }

      // Log the view
      const logSql = `
        INSERT INTO view_logs (article_id, identifier, expires_at)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
      `;
      await connection.execute(logSql, [articleId, identifier]);

      // Increment counts
      const updateSql = `
        UPDATE articles 
        SET views = views + 1,
            views_last_24h = views_last_24h + 1,
            views_last_7d = views_last_7d + 1
        WHERE id = ?
      `;
      await connection.execute(updateSql, [articleId]);

      await connection.commit();
      return { alreadyCounted: false };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getTrending({ limit = 10, categories = null, exclude = [] }) {
    let sql = `
      SELECT a.*,
        (SELECT JSON_ARRAYAGG(category) FROM article_categories WHERE article_id = a.id) as categories
      FROM articles a
      WHERE trending_score > 0
    `;
    const params = [];

    if (categories && categories.length > 0) {
      sql += ` AND EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category IN (?)
      )`;
      params.push(categories);
    }

    if (exclude.length > 0) {
      sql += ` AND a.id NOT IN (?)`;
      params.push(exclude);
    }

    sql += ` ORDER BY trending_score DESC, created_at DESC LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.execute(sql, params);
    rows.forEach(row => {
      row.categories = JSON.parse(row.categories || '[]');
    });
    return rows;
  },

  async getPopular({ limit = 10, categories = null, exclude = [] }) {
    let sql = `
      SELECT a.*,
        (SELECT JSON_ARRAYAGG(category) FROM article_categories WHERE article_id = a.id) as categories
      FROM articles a
      WHERE popular_score > 0
    `;
    const params = [];

    if (categories && categories.length > 0) {
      sql += ` AND EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category IN (?)
      )`;
      params.push(categories);
    }

    if (exclude.length > 0) {
      sql += ` AND a.id NOT IN (?)`;
      params.push(exclude);
    }

    sql += ` ORDER BY popular_score DESC, created_at DESC LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.execute(sql, params);
    rows.forEach(row => {
      row.categories = JSON.parse(row.categories || '[]');
    });
    return rows;
  },

  async search(searchQuery, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT a.*,
        MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance,
        (SELECT JSON_ARRAYAGG(category) FROM article_categories WHERE article_id = a.id) as categories
      FROM articles a
      WHERE MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE)
      ORDER BY relevance DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(sql, [searchQuery, searchQuery, limit, offset]);
    
    rows.forEach(row => {
      row.categories = JSON.parse(row.categories || '[]');
    });

    // Get total
    const countSql = `
      SELECT COUNT(*) as total FROM articles
      WHERE MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;
    const [countRows] = await pool.execute(countSql, [searchQuery]);

    return {
      results: rows,
      total: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit),
      currentPage: page
    };
  },

  async bulkUpdateScores(timeWindow = '24h') {
    const procedure = timeWindow === '24h' 
      ? 'CALL bulk_update_trending_scores()'
      : 'CALL bulk_update_popular_scores()';
    
    const [results] = await pool.execute(procedure);
    return results[0];
  }
};

// ==================== COMMENT MODEL ====================

const Comment = {
  async create(commentData) {
    const sql = `
      INSERT INTO comments (article_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      commentData.article,
      commentData.user,
      commentData.content
    ]);
    return result.insertId;
  },

  async findByArticle(articleId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT c.*,
        u.username, u.email, u.avatar,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id) as dislike_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(sql, [articleId, limit, offset]);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM comments WHERE article_id = ?';
    const [countRows] = await pool.execute(countSql, [articleId]);

    return {
      comments: rows,
      total: countRows[0].total,
      pages: Math.ceil(countRows[0].total / limit),
      page
    };
  },

  async update(commentId, content) {
    const sql = `
      UPDATE comments 
      SET content = ?, is_edited = TRUE, edited_at = NOW()
      WHERE id = ?
    `;
    await pool.execute(sql, [content, commentId]);
  },

  async delete(commentId) {
    const sql = 'DELETE FROM comments WHERE id = ?';
    await pool.execute(sql, [commentId]);
  },

  async toggleLike(commentId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Remove dislike if exists
      await connection.execute(
        'DELETE FROM comment_dislikes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );

      // Check if already liked
      const [existing] = await connection.execute(
        'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );

      if (existing.length > 0) {
        // Remove like
        await connection.execute(
          'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
          [commentId, userId]
        );
        await connection.commit();
        return { action: 'unliked' };
      } else {
        // Add like
        await connection.execute(
          'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
          [commentId, userId]
        );
        await connection.commit();
        return { action: 'liked' };
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async toggleDislike(commentId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Remove like if exists
      await connection.execute(
        'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );

      // Check if already disliked
      const [existing] = await connection.execute(
        'SELECT id FROM comment_dislikes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );

      if (existing.length > 0) {
        // Remove dislike
        await connection.execute(
          'DELETE FROM comment_dislikes WHERE comment_id = ? AND user_id = ?',
          [commentId, userId]
        );
        await connection.commit();
        return { action: 'undisliked' };
      } else {
        // Add dislike
        await connection.execute(
          'INSERT INTO comment_dislikes (comment_id, user_id) VALUES (?, ?)',
          [commentId, userId]
        );
        await connection.commit();
        return { action: 'disliked' };
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

const createIdentifier = (ip, userAgent) => {
  const data = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  User,
  Article,
  Comment,
  query,
  createIdentifier
};