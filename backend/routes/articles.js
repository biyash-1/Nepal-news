const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticate } = require("../middleware/auth");

router.get("/search", articleController.searchArticles);
router.get("/", articleController.getAllArticles);
router.get("/news/headlines", articleController.getHeadlines);
router.get("/news/other", articleController.getOtherNews);
router.get("/news/trending", articleController.getTrendingNews);
router.get("/news/popular", articleController.getPopularNews);
router.get(
  "/categories/multiple",
  articleController.getArticlesByMultipleCategories
);
router.get("/category/:category", articleController.getArticlesByCategory);

// Admin & root routes
router.post(
  "/admin/recalculate-scores",
  authenticate,
  articleController.recalculateScores
);
router.post("/", authenticate, articleController.createArticle);
router.post("/:id/view", articleController.incrementView);
router.put("/:id", authenticate, articleController.updateArticle);
router.delete("/:id", authenticate, articleController.deleteArticle);

router.get("/:id", articleController.getArticleById);

console.log("✅ Article routes configured successfully!");

module.exports = router;
