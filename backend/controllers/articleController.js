const { Article, createIdentifier } = require('../models');
const { pool } = require('../config/db');

// Helper to parse categories from query
const parseCategories = (catParam) => {
  if (!catParam) return undefined;

  // Special case: Bollywood
  if (catParam === "बॉलिउड") return ["बॉलिउड", "हॉलिउड"];

  try {
    const arr = JSON.parse(catParam);
    return Array.isArray(arr) ? arr : [arr];
  } catch {
    return [catParam]; // Single string fallback
  }
};

// Helper to fetch categories and tags for multiple articles
async function fetchArticleRelations(articleIds) {
  if (!articleIds.length) return { categories: {}, tags: {} };

  // Categories
  const [categoryRows] = await pool.execute(
    `SELECT article_id, category FROM article_categories WHERE article_id IN (${articleIds.map(() => '?').join(',')})`,
    articleIds
  );

  // Tags
  const [tagRows] = await pool.execute(
    `SELECT article_id, tag FROM article_tags WHERE article_id IN (${articleIds.map(() => '?').join(',')})`,
    articleIds
  );

  const categories = {};
  const tags = {};

  categoryRows.forEach(row => {
    if (!categories[row.article_id]) categories[row.article_id] = [];
    categories[row.article_id].push(row.category);
  });

  tagRows.forEach(row => {
    if (!tags[row.article_id]) tags[row.article_id] = [];
    tags[row.article_id].push(row.tag);
  });

  return { categories, tags };
}

// Helper to expand placeholders for array queries
function expandPlaceholders(arr) {
  return arr.map(() => '?').join(',');
}

// ============================
// GET ALL ARTICLES
// ============================
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const catArray = parseCategories(category);

    let sql = 'SELECT a.* FROM articles a WHERE 1=1';
    const params = [];

    if (catArray) {
      sql += ` AND EXISTS (
        SELECT 1 FROM article_categories ac WHERE ac.article_id = a.id AND ac.category IN (${expandPlaceholders(catArray)})
      )`;
      params.push(...catArray);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [articles] = await pool.execute(sql, params);

    // Attach categories and tags
    const articleIds = articles.map(a => a.id);
    const { categories: cats, tags: tgs } = await fetchArticleRelations(articleIds);
    articles.forEach(article => {
      article.categories = cats[article.id] || [];
      article.tags = tgs[article.id] || [];
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({
      success: true,
      articles,
      currentPage: parseInt(page),
      total: articles.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
      error: err.message
    });
  }
};

// ============================
// GET ARTICLE BY ID
// ============================
exports.getArticleById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    const article = rows[0];

    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    // Attach categories and tags
    const { categories: cats, tags: tgs } = await fetchArticleRelations([article.id]);
    article.categories = cats[article.id] || [];
    article.tags = tgs[article.id] || [];
    article.author = {
      userId: article.author_user_id,
      username: article.author_username,
      avatar: article.author_avatar
    };

    res.json({ success: true, article });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: err.message
    });
  }
};

// ============================
// INCREMENT VIEW
// ============================
exports.incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'] || 'unknown';
    const identifier = createIdentifier(clientIp, userAgent);

    const result = await Article.incrementView(id, identifier);
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    const article = rows[0];

    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    res.json({
      success: true,
      views: article.views || 0,
      viewsLast24h: article.views_last_24h || 0,
      trendingScore: article.trending_score || 0,
      alreadyCounted: result.alreadyCounted,
      message: result.alreadyCounted ? 'View already counted in last 24 hours' : 'View counted successfully'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to increment view",
      error: err.message
    });
  }
};

// ============================
// GET ARTICLES BY CATEGORY
// ============================
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, exclude = "" } = req.query;

    const excludedIds = exclude ? exclude.split(',').filter(Boolean) : [];

    let sql = `SELECT a.* FROM articles a WHERE EXISTS (
      SELECT 1 FROM article_categories ac WHERE ac.article_id = a.id AND ac.category = ?
    )`;
    const params = [category];

    if (excludedIds.length) {
      sql += ` AND a.id NOT IN (${expandPlaceholders(excludedIds)})`;
      params.push(...excludedIds);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` ORDER BY created_at DESC, id ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [articles] = await pool.execute(sql, params);

    const articleIds = articles.map(a => a.id);
    const { categories: cats } = await fetchArticleRelations(articleIds);
    articles.forEach(article => {
      article.categories = cats[article.id] || [];
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({
      success: true,
      articles,
      currentPage: parseInt(page),
      total: articles.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category articles",
      error: err.message
    });
  }
};

// ============================
// GET TRENDING NEWS
// ============================
exports.getTrendingNews = async (req, res) => {
  try {
    const { limit = 10, categories, exclude = "" } = req.query;
    const catArray = parseCategories(categories);
    const excludedIds = exclude ? exclude.split(',').filter(Boolean) : [];

    const articles = await Article.getTrending({ limit: parseInt(limit), categories: catArray, exclude: excludedIds });
    articles.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles, total: articles.length });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch trending news", error: err.message });
  }
};

// ============================
// GET POPULAR NEWS
// ============================
exports.getPopularNews = async (req, res) => {
  try {
    const { limit = 10, categories, exclude = "" } = req.query;
    const catArray = parseCategories(categories);
    const excludedIds = exclude ? exclude.split(',').filter(Boolean) : [];

    const articles = await Article.getPopular({ limit: parseInt(limit), categories: catArray, exclude: excludedIds });
    articles.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles, total: articles.length });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch popular news", error: err.message });
  }
};

// ============================
// SEARCH ARTICLES
// ============================
exports.searchArticles = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q || q.trim() === "") return res.json({ success: true, results: [], totalPages: 0, currentPage: 1, total: 0 });

    const result = await Article.search(q, parseInt(page), parseInt(limit));
    result.results.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, results: result.results, totalPages: result.totalPages, currentPage: result.currentPage, total: result.total });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to search articles", error: err.message });
  }
};

// ============================
// CREATE ARTICLE
// ============================
exports.createArticle = async (req, res) => {
  try {
    const { title, content, image, categories, tags } = req.body;

    const articleData = {
      title,
      content,
      image,
      categories: categories || [],
      tags: tags || [],
      author: {
        userId: req.user?.userId || "anonymous",
        username: req.user?.username || "Anonymous",
        avatar: req.user?.avatar || null,
      },
    };

    const articleId = await Article.create(articleData);
    const article = await Article.findById(articleId);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create article",
      error: err.message,
    });
  }
};

// ============================
// UPDATE ARTICLE
// ============================
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, image, categories, tags } = req.body;
    const articleId = req.params.id;

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }

    if (req.user && article.author_user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update article fields
      const updates = [];
      const params = [];
      
      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (content !== undefined) {
        updates.push('content = ?');
        params.push(content);
      }
      if (image !== undefined) {
        updates.push('image = ?');
        params.push(image);
      }

      if (updates.length > 0) {
        params.push(articleId);
        await connection.execute(
          `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
      }

      // Update categories if provided
      if (categories !== undefined) {
        await connection.execute('DELETE FROM article_categories WHERE article_id = ?', [articleId]);
        if (categories.length > 0) {
          const catValues = categories.map(cat => [articleId, cat]);
          await connection.query('INSERT INTO article_categories (article_id, category) VALUES ?', [catValues]);
        }
      }

      // Update tags if provided
      if (tags !== undefined) {
        await connection.execute('DELETE FROM article_tags WHERE article_id = ?', [articleId]);
        if (tags.length > 0) {
          const tagValues = tags.map(tag => [articleId, tag]);
          await connection.query('INSERT INTO article_tags (article_id, tag) VALUES ?', [tagValues]);
        }
      }

      await connection.commit();
      
      const updatedArticle = await Article.findById(articleId);

      res.json({
        success: true,
        message: "Article updated",
        article: updatedArticle,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update article",
      error: err.message,
    });
  }
};

exports.getArticlesByMultipleCategories = async (req, res) => {
  try {
    const { categories, page = 1, limit = 10, exclude = "" } = req.query;

    if (!categories) {
      return res.status(400).json({
        success: false,
        message: "Categories query param is required",
      });
    }

    // Parse categories safely
    const catArray = parseCategories(categories); // ['प्रदेश', 'कर्णाली']

    if (!catArray.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid categories format",
      });
    }

    const excludedIds = exclude ? exclude.split(",").filter(Boolean) : [];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 🔥 AND-BASED CATEGORY MATCHING QUERY
    let sql = `
      SELECT a.*
      FROM articles a
      JOIN article_categories ac ON ac.article_id = a.id
      WHERE ac.category IN (${catArray.map(() => "?").join(",")})
    `;

    const params = [...catArray];

    // Exclude article IDs if provided
    if (excludedIds.length) {
      sql += ` AND a.id NOT IN (${excludedIds.map(() => "?").join(",")})`;
      params.push(...excludedIds);
    }

    sql += `
      GROUP BY a.id
      HAVING COUNT(DISTINCT ac.category) = ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(catArray.length, parseInt(limit), offset);

    // Execute query
    const [articles] = await pool.execute(sql, params);

    // Attach categories + author
    const articleIds = articles.map(a => a.id);

    if (articleIds.length) {
      const { categories: cats } = await fetchArticleRelations(articleIds);

      articles.forEach(article => {
        article.categories = cats[article.id] || [];
        article.author = {
          userId: article.author_user_id,
          username: article.author_username,
          avatar: article.author_avatar,
        };
      });
    }

    res.json({
      success: true,
      articles,
      currentPage: parseInt(page),
      total: articles.length,
    });

  } catch (err) {
    console.error("Multiple category fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles by multiple categories",
      error: err.message,
    });
  }
};


exports.recalculateScores = async (req, res) => {
  try {
    // Example: you can implement your logic here
    // For now, just simulating recalculation
    const [articles] = await pool.execute('SELECT * FROM articles');

    // Example scoring logic
    for (const article of articles) {
      const trendingScore = (article.views_last_24h || 0) * 2 + (article.views || 0);
      const popularScore = article.views || 0;

      await pool.execute(
        'UPDATE articles SET trending_score = ?, popular_score = ? WHERE id = ?',
        [trendingScore, popularScore, article.id]
      );
    }

    res.json({
      success: true,
      message: 'Trending and popular scores recalculated successfully',
      totalArticles: articles.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to recalculate scores',
      error: err.message
    });
  }
};

// ============================
// GET OTHER NEWS
// ============================
exports.getOtherNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, exclude = "", category = "" } = req.query;
    const excludedIds = exclude ? exclude.split(',').filter(Boolean) : [];

    let sql = 'SELECT * FROM articles';
    const params = [];
    const whereClauses = [];

    // Exclude specific article IDs
    if (excludedIds.length) {
      whereClauses.push(`id NOT IN (${excludedIds.map(() => '?').join(',')})`);
      params.push(...excludedIds);
    }

    // Filter by category
    if (category) {
      // Join with article_categories to filter by category
      sql = `
        SELECT a.* FROM articles a
        JOIN article_categories ac ON ac.article_id = a.id
      `;
      whereClauses.push(`ac.category = ?`);
      params.push(category);
    }

    if (whereClauses.length) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [articles] = await pool.execute(sql, params);

    // Attach categories & author
    const articleIds = articles.map(a => a.id);
    const { categories: cats } = await fetchArticleRelations(articleIds);
    articles.forEach(article => {
      article.categories = cats[article.id] || [];
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({
      success: true,
      articles,
      currentPage: parseInt(page),
      total: articles.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch other news",
      error: err.message
    });
  }
};

// ============================
// DELETE ARTICLE
// ============================
exports.deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }

    if (req.user && article.author_user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await pool.execute('DELETE FROM articles WHERE id = ?', [articleId]);

    res.json({ 
      success: true, 
      message: "Article deleted" 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
      error: err.message,
    });
  }
};