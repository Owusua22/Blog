const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth.middleware")

const {
  addComment,
  getCommentsByArticle,
  getComment,
  updateComment,
  deleteComment
} = require("../controllers/comment.controller")

// Add a comment to an article
router.post("/:articleId", protect, addComment)

// Get all comments for an article
router.get("/:articleId", getCommentsByArticle)

// Get single comment
router.get("/comment/:commentId", getComment)

// Update a comment
router.put("/comment/:commentId", protect, updateComment)

// Delete a comment
router.delete("/comment/:commentId", protect, deleteComment)

module.exports = router
