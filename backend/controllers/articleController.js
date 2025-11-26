// controllers/articleController.js
const Article = require('../models/Article');

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

    // Optionally increment views
    await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
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

    // If categories contain only ["बलिउड", "हलिउड"], use OR logic
    const isBollywoodRequest = 
      categoryArray.length === 2 && 
      categoryArray.includes("बलिउड") && 
      categoryArray.includes("हलिउड");

    let query;
    if (isBollywoodRequest) {
      // OR logic: article must include at least one category
      query = { categories: { $in: categoryArray } };
    } else {
      // AND logic: article must include all categories
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
      tags: { $ne: "लोकप्रिय" }, // Exclude articles with tag "लोकप्रिय"
    };

    if (exclude) {
      query._id = { $ne: exclude };
    }

    // Calculate skip value with special logic for page > 1
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

    // Validate query
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

    // Normalize and split query into keywords
    const keywords = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(k => k.length > 0);

    const fullQuery = keywords.join(" ");

    // Find all articles
    const allArticles = await Article.find({}).lean();

    // Score and filter articles
    const scoredArticles = allArticles
      .map(article => {
        const titleLower = (article.title || "").toLowerCase();
        const contentLower = (article.content || "").toLowerCase();

        let score = 0;

        // 1. Exact phrase match (highest priority)
        if (titleLower.includes(fullQuery)) {
          score += 100 * 2; // Title match with 2x multiplier
        }
        if (contentLower.includes(fullQuery)) {
          score += 100; // Content match
        }

        // 2. Individual keyword matching
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

        // Calculate keyword match percentage
        const matchPercentage = Math.max(titleMatches, contentMatches) / keywords.length;

        // All keywords present
        if (matchPercentage === 1) {
          score += 80 * (titleMatches > 0 ? 2 : 1); // 160 for title, 80 for content
        }
        // Partial match (>50% keywords)
        else if (matchPercentage > 0.5) {
          score += 60 * matchPercentage * (titleMatches > 0 ? 2 : 1);
        }
        // Some match
        else if (matchPercentage > 0) {
          score += 40 * matchPercentage * (titleMatches > 0 ? 2 : 1);
        }

        return {
          ...article,
          searchScore: Math.round(score)
        };
      })
      .filter(article => article.searchScore >= 40) // Minimum threshold
      .sort((a, b) => {
        // Sort by score (highest first), then by date (newest first)
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    // Pagination
    const start = (page - 1) * parseInt(limit);
    const paginated = scoredArticles.slice(start, start + parseInt(limit));

    // Remove searchScore from response
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

    // Check authorization
    if (req.user && article.author?.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update fields
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

    // Check authorization
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