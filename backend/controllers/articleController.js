const Article = require('../models/Article');

// Get all articles with pagination and filters
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    const query = category ? { categories: category } : {};
    
    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

      console.log("articles",articles)

    const count = await Article.countDocuments(query);

    res.json({
      success: true,
      articles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch articles', 
      error: error.message 
    });
  }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username avatar');

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    res.json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch article', 
      error: error.message 
    });
  }
};

// Get articles by category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const articles = await Article.find({ categories: category })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Article.countDocuments({ categories: category });

    res.json({
      success: true,
      articles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch articles', 
      error: error.message 
    });
  }
};

// Create new article (requires authentication)
exports.createArticle = async (req, res) => {
  try {
    const { title, content, image, categories } = req.body;

    const article = new Article({
      title,
      content,
      image,
      categories,
      author: req.user.userId
    });

    await article.save();

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create article', 
      error: error.message 
    });
  }
};

// Update article (requires authentication)
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, image, categories } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this article' 
      });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.image = image || article.image;
    article.categories = categories || article.categories;

    await article.save();

    res.json({
      success: true,
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update article', 
      error: error.message 
    });
  }
};

// Delete article (requires authentication)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this article' 
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete article', 
      error: error.message 
    });
  }
};