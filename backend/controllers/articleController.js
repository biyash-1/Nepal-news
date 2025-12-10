// controllers/articleController.js
const Article = require('../models/Article');
const ViewLog = require('../models/ViewLog');
const crypto = require('crypto');

// Helper function to create unique identifier from IP + User Agent
const createIdentifier = (ip, userAgent) => {
  const data = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

const parseCategories = (catParam) => {
  if (!catParam) return undefined;

  // Special case: Bollywood
  if (catParam === "बलिउड") return ["बलिउड", "हलिउड"];

  // Try parsing as JSON array
  try {
    const arr = JSON.parse(catParam);
    return Array.isArray(arr) ? arr : [arr];
  } catch {
    return [catParam]; // Single string
  }
};

// ============================
// GET ALL ARTICLES (with pagination + category filter)
// ============================
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const query = category ? { categories: category } : {};

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit))
      .lean();

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
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
// GET SINGLE ARTICLE BY ID
// ============================
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();

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
    
    // Check if this identifier has viewed this article in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await ViewLog.findOne({
      article: id,
      identifier: identifier,
      viewedAt: { $gte: twentyFourHoursAgo }
    });
    
    if (existingView) {
      // Already viewed recently - don't count again
      const article = await Article.findById(id).lean();
      return res.json({ 
        success: true, 
        views: article.views || 0,
        viewsLast24h: article.viewsLast24h || 0,
        trendingScore: article.trendingScore || 0,
        alreadyCounted: true,
        message: 'View already counted in last 24 hours'
      });
    }
    
    // Find article
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Log the view with 7-day expiration
    await ViewLog.create({
      article: id,
      identifier: identifier,
      viewedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Increment view count (includes rolling window updates)
    await article.incrementView();

    res.json({ 
      success: true, 
      views: article.views,
      viewsLast24h: article.viewsLast24h,
      trendingScore: article.trendingScore,
      alreadyCounted: false,
      message: 'View counted successfully'
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
// GET /news/headlines
// Latest 3 articles
// ============================
exports.getHeadlines = async (req, res) => {
  try {
    const { limit = 3, categories, category } = req.query;

    const catParam = categories || category;

    let query = {};
    if (catParam) {
      let categoryArray;
      try {
        categoryArray = JSON.parse(catParam);
        if (!Array.isArray(categoryArray)) categoryArray = [categoryArray];
      } catch {
        categoryArray = [catParam];
      }

      query.categories = { $in: categoryArray };
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

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
// GET /news/other
// ============================
exports.getOtherNews = async (req, res) => {
  try {
    const { exclude = "", limit = 20, categories, category } = req.query;

    const excludedIds = exclude
      ? exclude.split(",").map(id => id.trim()).filter(Boolean)
      : [];

    const catParam = categories || category;
    const categoryArray = parseCategories(catParam);

    const query = {
      ...(excludedIds.length && { _id: { $nin: excludedIds } }),
      ...(categoryArray && { categories: { $in: categoryArray } }), // Match any
    };

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch other news",
      error: err.message,
    });
  }
};

// ============================
// GET /news/trending
// ============================
exports.getTrendingNews = async (req, res) => {
  try {
    const { limit = 10, categories, category } = req.query;
    const categoryArray = parseCategories(categories || category);

    const query = categoryArray ? { categories: { $in: categoryArray } } : {};

    const articles = await Article.find(query)
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const filtered = articles.filter(a => a.trendingScore > 0);

    res.json({ success: true, articles: filtered, total: filtered.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending news",
      error: err.message,
    });
  }
};

// ============================
// GET /news/popular
// ============================
exports.getPopularNews = async (req, res) => {
  try {
    const { limit = 10, categories, category } = req.query;
    const categoryArray = parseCategories(categories || category);

    const query = categoryArray ? { categories: { $in: categoryArray } } : {};

    const articles = await Article.find(query)
      .sort({ popularScore: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const filtered = articles.filter(a => a.popularScore > 0);

    res.json({ success: true, articles: filtered, total: filtered.length });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular news",
      error: err.message,
    });
  }
};


// ============================
// ADMIN: Manually trigger score recalculation
// ============================
exports.recalculateScores = async (req, res) => {
  try {
    const { timeWindow = 'both' } = req.body;
    
    const results = {};
    
    if (timeWindow === '24h' || timeWindow === 'both') {
      const result24h = await Article.bulkUpdateScores('24h');
      results.trending = result24h;
    }
    
    if (timeWindow === '7d' || timeWindow === 'both') {
      const result7d = await Article.bulkUpdateScores('7d');
      results.popular = result7d;
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

    const isBollywoodRequest = 
      categoryArray.length === 2 && 
      categoryArray.includes("बलिउड") && 
      categoryArray.includes("हलिउड");

    let query;
    if (isBollywoodRequest) {
      query = { categories: { $in: categoryArray } };
    } else {
      query = { categories: { $all: categoryArray } };
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

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
    const { page = 1, limit = 10, exclude } = req.query;

    const query = {
      categories: category,
      tags: { $ne: "लोकप्रिय" },
    };

    if (exclude) {
      query._id = { $ne: exclude };
    }

    let skip = (page - 1) * parseInt(limit);
    if (page > 1) {
      skip += 1;
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
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

    const keywords = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(k => k.length > 0);

    const fullQuery = keywords.join(" ");
    const allArticles = await Article.find({}).lean();

    const scoredArticles = allArticles
      .map(article => {
        const titleLower = (article.title || "").toLowerCase();
        const contentLower = (article.content || "").toLowerCase();

        let score = 0;

        if (titleLower.includes(fullQuery)) {
          score += 100 * 2;
        }
        if (contentLower.includes(fullQuery)) {
          score += 100;
        }

        let titleMatches = 0;
        let contentMatches = 0;

        keywords.forEach(keyword => {
          if (titleLower.includes(keyword)) {
            titleMatches++;
          }
          if (contentLower.includes(keyword)) {
            contentMatches++;
          }
        });

        const matchPercentage = Math.max(titleMatches, contentMatches) / keywords.length;

        if (matchPercentage === 1) {
          score += 80 * (titleMatches > 0 ? 2 : 1);
        }
        else if (matchPercentage > 0.5) {
          score += 60 * matchPercentage * (titleMatches > 0 ? 2 : 1);
        }
        else if (matchPercentage > 0) {
          score += 40 * matchPercentage * (titleMatches > 0 ? 2 : 1);
        }

        return {
          ...article,
          searchScore: Math.round(score)
        };
      })
      .filter(article => article.searchScore >= 40)
      .sort((a, b) => {
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    const start = (page - 1) * parseInt(limit);
    const paginated = scoredArticles.slice(start, start + parseInt(limit));
    const results = paginated.map(({ searchScore, ...article }) => article);

    res.json({
      success: true,
      results,
      totalPages: Math.ceil(scoredArticles.length / limit),
      currentPage: Number(page),
      total: scoredArticles.length,
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

    const newArticle = new Article({
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
    });

    await newArticle.save();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article: newArticle,
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

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }

    if (req.user && article.author?.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (image !== undefined) article.image = image;
    if (categories !== undefined) article.categories = categories;
    if (tags !== undefined) article.tags = tags;

    await article.save();

    res.json({
      success: true,
      message: "Article updated",
      article,
    });
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
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }

    if (req.user && article.author?.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Article.findByIdAndDelete(req.params.id);

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