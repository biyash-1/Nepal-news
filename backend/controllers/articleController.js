// controllers/articleController.js
const Article = require('../models/Article');
const ViewLog = require('../models/ViewLog');
const crypto = require('crypto');
const { getTrendingConfig } = require('../config/trendingConfig');

// Helper function to create unique identifier from IP + User Agent
const createIdentifier = (ip, userAgent) => {
  const data = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// GET ALL ARTICLES (with pagination + category filter)
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

// GET SINGLE ARTICLE BY ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Return article without incrementing view
    // View will be incremented by separate endpoint
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: err.message,
    });
  }
};

// INCREMENT VIEW COUNT (with backend tracking)
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
        isTrending: article.isTrending || false,
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

    // Log the view
    await ViewLog.create({
      article: id,
      identifier: identifier,
      viewedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Increment view count
    await article.incrementView();
    
    // Check if we should update trending status
    const config = getTrendingConfig();
    const timeSinceLastCheck = Date.now() - article.lastTrendingCheck.getTime();
    const checkInterval = config.checkIntervalMinutes * 60 * 1000;
    
    if (timeSinceLastCheck > checkInterval) {
      await article.updateTrendingStatus(config);
    }

    res.json({ 
      success: true, 
      views: article.views,
      isTrending: article.isTrending,
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

// GET TRENDING ARTICLES
exports.getTrendingArticles = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const articles = await Article.find({ isTrending: true })
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      articles,
      total: articles.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending articles",
      error: err.message,
    });
  }
};

// ADMIN: Update trending config
exports.updateTrendingConfig = async (req, res) => {
  try {
    const { minRecentViews, timeWindowHours, minTotalViews, checkIntervalMinutes, viewCountDelay } = req.body;
    
    const updates = {};
    if (minRecentViews !== undefined) updates.minRecentViews = minRecentViews;
    if (timeWindowHours !== undefined) updates.timeWindowHours = timeWindowHours;
    if (minTotalViews !== undefined) updates.minTotalViews = minTotalViews;
    if (checkIntervalMinutes !== undefined) updates.checkIntervalMinutes = checkIntervalMinutes;
    if (viewCountDelay !== undefined) updates.viewCountDelay = viewCountDelay;
    
    const { updateTrendingConfig } = require('../config/trendingConfig');
    updateTrendingConfig(updates);
    
    res.json({
      success: true,
      message: "Trending config updated",
      config: require('../config/trendingConfig').trendingConfig
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update config",
      error: err.message,
    });
  }
};

// ADMIN: Get current trending config
exports.getTrendingConfigEndpoint = async (req, res) => {
  try {
    const config = getTrendingConfig();
    res.json({
      success: true,
      config
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get config",
      error: err.message,
    });
  }
};

// ADMIN: Manually recalculate trending for all articles
exports.recalculateTrending = async (req, res) => {
  try {
    const config = getTrendingConfig();
    const articles = await Article.find({});
    
    let updated = 0;
    for (const article of articles) {
      const wasTrending = article.isTrending;
      await article.updateTrendingStatus(config);
      if (wasTrending !== article.isTrending) {
        updated++;
      }
    }
    
    res.json({
      success: true,
      message: `Recalculated trending status for ${articles.length} articles`,
      updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to recalculate trending",
      error: err.message,
    });
  }
};

// GET ARTICLES BY MULTIPLE CATEGORIES
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

// GET ARTICLES BY CATEGORY
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

// SEARCH ARTICLES
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

// CREATE ARTICLE
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

// UPDATE ARTICLE
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

// DELETE ARTICLE
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