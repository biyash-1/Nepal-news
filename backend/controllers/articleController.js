const { Article, createIdentifier } = require('../models');
const { pool } = require('../config/db');

// Helper to parse categories from query
const parseCategories = (catParam) => {
  if (!catParam) return undefined;

  // Special case: Bollywood
  if (catParam === "बॉलिउड") return ["बॉलिउड", "हॉलिउड"];

  // Try parsing as JSON array
  try {
    const arr = JSON.parse(catParam);
    return Array.isArray(arr) ? arr : [arr];
  } catch {
    return [catParam]; // Single string
  }
};

// Helper function to fetch categories and tags for articles
async function fetchArticleRelations(articleIds) {
  if (!articleIds.length) return { categories: {}, tags: {} };
  
  // Fetch all categories
  const [categoryRows] = await pool.execute(
    'SELECT article_id, category FROM article_categories WHERE article_id IN (?)',
    [articleIds]
  );
  
  // Fetch all tags
  const [tagRows] = await pool.execute(
    'SELECT article_id, tag FROM article_tags WHERE article_id IN (?)',
    [articleIds]
  );
  
  // Group by article_id
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

// ============================
// GET ALL ARTICLES (with pagination)
// ============================
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const result = await Article.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category
    });

    res.json({
      success: true,
      articles: result.articles,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      total: result.total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
      error: err.message,
    });
  }
};

// ============================
// GET ARTICLE BY ID
// ============================
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: err.message,
    });
  }
};

// ============================
// INCREMENT VIEW COUNT
// ============================
exports.incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get client IP and user agent
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Create unique identifier
    const identifier = createIdentifier(clientIp, userAgent);
    
    // Increment view (checks for duplicates internally)
    const result = await Article.incrementView(id, identifier);
    
    // Get updated article data
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({ 
      success: true, 
      views: article.views || 0,
      viewsLast24h: article.views_last_24h || 0,
      trendingScore: article.trending_score || 0,
      alreadyCounted: result.alreadyCounted,
      message: result.alreadyCounted ? 'View already counted in last 24 hours' : 'View counted successfully'
    });
  } catch (err) {
    console.error('View increment error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to increment view",
      error: err.message,
    });
  }
};

// ============================
// GET HEADLINES (Latest articles)
// ============================
exports.getHeadlines = async (req, res) => {
  try {
    const { limit = 3, categories, category } = req.query;
    const catParam = categories || category;
    const categoryArray = parseCategories(catParam);

    let sql = 'SELECT a.* FROM articles a';
    const params = [];

    if (categoryArray) {
      sql += ` WHERE EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category IN (?)
      )`;
      params.push(categoryArray);
    }

    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [articles] = await pool.execute(sql, params);
    
    // Fetch categories and tags separately
    const articleIds = articles.map(a => a.id);
    const { categories: cats, tags: tgs } = await fetchArticleRelations(articleIds);
    
    // Transform results
    articles.forEach(article => {
      article.categories = cats[article.id] || [];
      article.tags = tgs[article.id] || [];
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch headlines",
      error: err.message,
    });
  }
};

// ============================
// GET OTHER NEWS (with pagination)
// ============================
exports.getOtherNews = async (req, res) => {
  try {
    const { exclude = "", page = 1, limit = 20, categories, category } = req.query;

    const excludedIds = exclude
      ? exclude.split(",").map(id => id.trim()).filter(Boolean)
      : [];

    const categoryArray = parseCategories(categories || category);

    let sql = 'SELECT a.* FROM articles a WHERE 1=1';
    const params = [];

    if (excludedIds.length > 0) {
      sql += ` AND a.id NOT IN (?)`;
      params.push(excludedIds);
    }

    if (categoryArray) {
      sql += ` AND EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category IN (?)
      )`;
      params.push(categoryArray);
    }

    // Get total count first
    const countSql = sql.replace('SELECT a.*', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0].total;

    // Add pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    sql += ` ORDER BY created_at DESC, id ASC LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const [articles] = await pool.execute(sql, params);
    
    // Fetch categories separately
    const articleIds = articles.map(a => a.id);
    const { categories: cats } = await fetchArticleRelations(articleIds);
    
    // Transform results
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
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch other news",
      error: err.message,
    });
  }
};

// ============================
// GET TRENDING NEWS
// ============================
exports.getTrendingNews = async (req, res) => {
  try {
    const { limit = 10, categories, category, exclude = "" } = req.query;
    const categoryArray = parseCategories(categories || category);

    const excludedIds = exclude
      ? exclude.split(",").map(id => id.trim()).filter(Boolean)
      : [];

    const articles = await Article.getTrending({
      limit: parseInt(limit),
      categories: categoryArray,
      exclude: excludedIds
    });

    // Transform results
    articles.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles, total: articles.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending news",
      error: err.message,
    });
  }
};

// ============================
// GET POPULAR NEWS
// ============================
exports.getPopularNews = async (req, res) => {
  try {
    const { limit = 10, categories, category, exclude = "" } = req.query;
    const categoryArray = parseCategories(categories || category);

    const excludedIds = exclude
      ? exclude.split(",").map(id => id.trim()).filter(Boolean)
      : [];

    const articles = await Article.getPopular({
      limit: parseInt(limit),
      categories: categoryArray,
      exclude: excludedIds
    });

    // Transform results
    articles.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles, total: articles.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular news",
      error: err.message,
    });
  }
};

// ============================
// RECALCULATE SCORES (Admin)
// ============================
exports.recalculateScores = async (req, res) => {
  try {
    const { timeWindow = 'both' } = req.body;
    
    const results = {};
    
    if (timeWindow === '24h' || timeWindow === 'both') {
      const [result24h] = await pool.execute('CALL bulk_update_trending_scores()');
      results.trending = result24h[0];
    }
    
    if (timeWindow === '7d' || timeWindow === 'both') {
      const [result7d] = await pool.execute('CALL bulk_update_popular_scores()');
      results.popular = result7d[0];
    }
    
    res.json({
      success: true,
      message: 'Scores recalculated successfully',
      results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to recalculate scores",
      error: err.message,
    });
  }
};

// ============================
// GET ARTICLES BY MULTIPLE CATEGORIES
// ============================
exports.getArticlesByMultipleCategories = async (req, res) => {
  try {
    let { categories, limit = 10 } = req.query;

    if (!categories) {
      return res.status(400).json({
        success: false,
        message: "Categories are required",
      });
    }

    let categoryArray;
    try {
      categoryArray = JSON.parse(categories);
      if (!Array.isArray(categoryArray)) throw new Error();
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid categories format. Must be valid JSON array.",
      });
    }

    // Build SQL with placeholders
    const placeholders = categoryArray.map(() => '?').join(',');
    const sql = `
      SELECT a.* 
      FROM articles a 
      WHERE EXISTS (
        SELECT 1 
        FROM article_categories ac 
        WHERE ac.article_id = a.id 
        AND ac.category IN (${placeholders})
      )
      ORDER BY created_at DESC 
      LIMIT ?
    `;

    // Params: spread categories + limit
    const params = [...categoryArray, parseInt(limit)];

    const [articles] = await pool.execute(sql, params);

    // Fetch categories and tags separately
    const articleIds = articles.map(a => a.id);
    const { categories: cats, tags: tgs } = await fetchArticleRelations(articleIds);

    // Transform results
    articles.forEach(article => {
      article.categories = cats[article.id] || [];
      article.tags = tgs[article.id] || [];
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({ success: true, articles });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
      error: err.message,
    });
  }
};


// ============================
// GET ARTICLES BY CATEGORY
// ============================
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 100, exclude = "" } = req.query;

    const excludedIds = exclude
      ? exclude.split(",").map(id => id.trim()).filter(Boolean)
      : [];

    let sql = `
      SELECT a.* FROM articles a
      WHERE EXISTS (
        SELECT 1 FROM article_categories 
        WHERE article_id = a.id AND category = ?
      )
    `;
    const params = [category];

    if (excludedIds.length > 0) {
      sql += ` AND a.id NOT IN (?)`;
      params.push(excludedIds);
    }

    // Get total count
    const countSql = sql.replace('SELECT a.*', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0].total;

    // Add pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    sql += ` ORDER BY created_at DESC, id ASC LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const [articles] = await pool.execute(sql, params);
    
    // Fetch categories separately
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
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category articles",
      error: err.message,
    });
  }
};

// ============================
// SEARCH ARTICLES
// ============================
exports.searchArticles = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim() === "") {
      return res.json({
        success: true,
        results: [],
        totalPages: 0,
        currentPage: Number(page),
        total: 0,
        message: "खोज शब्द आवश्यक छ"
      });
    }

    const result = await Article.search(query, parseInt(page), parseInt(limit));

    // Transform results
    result.results.forEach(article => {
      article.author = {
        userId: article.author_user_id,
        username: article.author_username,
        avatar: article.author_avatar
      };
    });

    res.json({
      success: true,
      results: result.results,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      total: result.total,
      query
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "खोजीमा समस्या भयो",
      error: err.message
    });
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