// routes/article.routes.js
const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload.middleware")
const { protect } = require("../middleware/auth.middleware")

const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  likeArticle
} = require("../controllers/article.controller")

// ================================
// PUBLIC ROUTES
// ================================
router.get("/", getArticles)
router.get("/:id", getArticle)

// ================================
// PROTECTED ROUTES
// ================================
router.post(
  "/",
  protect,
  upload.single("image"),
  createArticle
)

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateArticle
)

router.delete(
  "/:id",
  protect,
  deleteArticle
)

router.post(
  "/:id/like",
  protect,
  likeArticle
)

module.exports = router
