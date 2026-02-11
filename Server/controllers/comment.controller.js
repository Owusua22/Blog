const Comment = require("../models/Comment")

// ================================
// CREATE COMMENT
// ================================
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ message: "Comment text is required" })

    const comment = await Comment.create({
      article: req.params.articleId,
      user: req.user.id,
      text
    })

    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ================================
// GET ALL COMMENTS FOR AN ARTICLE
// ================================
exports.getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ================================
// GET SINGLE COMMENT
// ================================
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate("user", "name email")
    if (!comment) return res.status(404).json({ message: "Comment not found" })
    res.json(comment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ================================
// UPDATE COMMENT
// ================================
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })

    // Only the author or admin can update
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" })

    comment.text = req.body.text || comment.text
    await comment.save()
    res.json(comment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ================================
// DELETE COMMENT
// ================================
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })

    // Only author or admin can delete
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" })

    await comment.remove()
    res.json({ message: "Comment deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
