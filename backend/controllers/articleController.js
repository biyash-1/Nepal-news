const fs = require("fs").promises;
const path = require("path");

// Path to the JSON file
const NEWS_JSON_PATH = path.join(__dirname, "../data/news.json");

// Read JSON
const readNewsData = async () => {
  try {
    const raw = await fs.readFile(NEWS_JSON_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading news.json:", err);
    return [];
  }
};

// Write JSON
const writeNewsData = async (data) => {
  try {
    await fs.writeFile(NEWS_JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing news.json:", err);
    return false;
  }
};

// GET ALL ARTICLES (with pagination + category filter)
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    let articles = await readNewsData();

    if (category) {
      articles = articles.filter((a) => a.categories?.includes(category));
    }

    // Sort newest first
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * parseInt(limit);
    const paginated = articles.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      articles: paginated,
      totalPages: Math.ceil(articles.length / limit),
      currentPage: Number(page),
      total: articles.length,
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
    const articles = await readNewsData();
    const article = articles.find((a) => a.id === req.params.id);

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

    // Read all articles
    let articles = await readNewsData();

    // Filter articles:
    // If categories contain only ["बलिउड", "हलिउड"], use OR logic
    const isBollywoodRequest = categoryArray.length === 2 && categoryArray.includes("बलिउड") && categoryArray.includes("हलिउड");

    if (isBollywoodRequest) {
      articles = articles.filter(article =>
        article.categories?.some(cat => categoryArray.includes(cat))
      );
    } else {
      // Normal AND logic: article must include all categories
      articles = articles.filter(article =>
        categoryArray.every(cat => article.categories?.includes(cat))
      );
    }

    // Sort newest first
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply limit
    articles = articles.slice(0, parseInt(limit));

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
    let articles = await readNewsData();

    // Filter by category
    articles = articles.filter((a) => a.categories?.includes(category));

    if (exclude) {
      articles = articles.filter((a) => a.id !== exclude);
    }

    // Exclude articles with the tag "लोकप्रिय"
    articles = articles.filter((a) => !a.tags?.includes("लोकप्रिय"));

    // Sort by newest first
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    let start = (page - 1) * parseInt(limit);
    if (page>1){
      start+=1;
    }
    const paginated = articles.slice(start, start + parseInt(limit));
   
    res.json({
      success: true,
      articles: paginated,
      totalPages: Math.ceil(articles.length / limit),
      currentPage: Number(page),
      total: articles.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category articles",
      error: err.message,
    });
  }
};

// Add this to your controllers/articleController.js

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

    // Read all articles
    let articles = await readNewsData();

    // Normalize and split query into keywords
    const keywords = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(k => k.length > 0);

    // Score and filter articles
    const scoredArticles = articles
      .map(article => {
        const titleLower = (article.title || "").toLowerCase();
        const contentLower = (article.content || "").toLowerCase();
        const fullQuery = keywords.join(" ");

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

    // Remove searchScore from response (optional, for cleaner output)
    const results = paginated.map(({ searchScore, ...article }) => article);

    res.json({
      success: true,
      results: results,
      totalPages: Math.ceil(scoredArticles.length / limit),
      currentPage: Number(page),
      total: scoredArticles.length,
      query: query
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
    const { title, content, image, categories } = req.body;

    let articles = await readNewsData();

    // Generate ID
    const newId =
      articles.length > 0
        ? (Math.max(...articles.map((a) => Number(a.id))) + 1).toString()
        : "1";

    const newArticle = {
      id: newId,
      title,
      content,
      image,
      categories: categories || [],
      author: {
        userId: req.user?.userId || "anonymous",
        username: req.user?.username || "Anonymous",
        avatar: req.user?.avatar || null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articles.push(newArticle);
    await writeNewsData(articles);

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
    const { title, content, image, categories } = req.body;

    let articles = await readNewsData();
    const index = articles.findIndex((a) => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const old = articles[index];

    if (req.user && old.author?.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    articles[index] = {
      ...old,
      title: title ?? old.title,
      content: content ?? old.content,
      image: image ?? old.image,
      categories: categories ?? old.categories,
      updatedAt: new Date().toISOString(),
    };

    await writeNewsData(articles);

    res.json({
      success: true,
      message: "Article updated",
      article: articles[index],
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
    let articles = await readNewsData();
    const index = articles.findIndex((a) => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const article = articles[index];

    if (req.user && article.author?.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    articles.splice(index, 1);
    await writeNewsData(articles);

    res.json({ success: true, message: "Article deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
      error: err.message,
    });
  }
};
