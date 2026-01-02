const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticate } = require("../middleware/auth");

// ===== Helper to check controller functions =====
function assertHandler(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`Controller function "${name}" is not defined or not a function`);
  }
  return fn;
}

// ============================
// Public Routes
// ============================

// Search articles
router.get("/search", assertHandler(articleController.searchArticles, "searchArticles"));

// Get all articles with pagination
router.get("/", assertHandler(articleController.getAllArticles, "getAllArticles"));

// Get other news with pagination
router.get("/news/other", assertHandler(articleController.getOtherNews, "getOtherNews"));

// Get trending news
router.get("/news/trending", assertHandler(articleController.getTrendingNews, "getTrendingNews"));

// Get popular news
router.get("/news/popular", assertHandler(articleController.getPopularNews, "getPopularNews"));

// Get articles by multiple categories
router.get(
  "/categories/multiple",
  assertHandler(articleController.getArticlesByMultipleCategories, "getArticlesByMultipleCategories")
);

// Get articles by single category
router.get("/category/:category", assertHandler(articleController.getArticlesByCategory, "getArticlesByCategory"));

// Increment view count for an article
router.post("/:id/view", assertHandler(articleController.incrementView, "incrementView"));

// Get single article by ID
router.get("/:id", assertHandler(articleController.getArticleById, "getArticleById"));

// ============================
// Admin / Authenticated Routes
// ============================

// Recalculate trending & popular scores (Admin)
router.post(
  "/admin/recalculate-scores",
  authenticate,
  assertHandler(articleController.recalculateScores, "recalculateScores")
);

// Create new article
router.post("/", authenticate, assertHandler(articleController.createArticle, "createArticle"));

// Update existing article
router.put("/:id", authenticate, assertHandler(articleController.updateArticle, "updateArticle"));

// Delete article
router.delete("/:id", authenticate, assertHandler(articleController.deleteArticle, "deleteArticle"));

// ============================
// Route configuration check
// ============================
console.log("✅ Article routes configured successfully!");
console.log("Available controller functions:", Object.keys(articleController));

module.exports = router;
