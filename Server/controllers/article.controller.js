// controllers/article.controller.js
const Article = require("../models/Article")
const Comment = require("../models/Comment")
const cloudinary = require("../config/cloudinary")
const fs = require("fs")

// ================================
// CREATE ARTICLE
// ================================
exports.createArticle = async (req, res) => {
  try {
    let coverImage = null

    // Upload image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "articles"
      })

      coverImage = {
        url: result.secure_url,
        publicId: result.public_id
      }

      fs.unlinkSync(req.file.path)
    }

    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      coverImage,
      author: req.user.id
    })

    res.status(201).json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// GET ALL ARTICLES
// ================================
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })

    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// GET SINGLE ARTICLE + COMMENTS
// ================================
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "name email")

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    const comments = await Comment.find({ article: article._id })
      .populate("user", "name email")

    res.json({ article, comments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// UPDATE ARTICLE
// ================================
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    // Authorization
    if (
      article.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    // Replace image if new one is uploaded
    if (req.file) {
      if (article.coverImage?.publicId) {
        await cloudinary.uploader.destroy(article.coverImage.publicId)
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "articles"
      })

      article.coverImage = {
        url: result.secure_url,
        publicId: result.public_id
      }

      fs.unlinkSync(req.file.path)
    }

    article.title = req.body.title ?? article.title
    article.content = req.body.content ?? article.content
    article.documents = req.body.documents ?? article.documents

    await article.save()
    res.json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// DELETE ARTICLE
// ================================
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    if (
      article.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    if (article.coverImage?.publicId) {
      await cloudinary.uploader.destroy(article.coverImage.publicId)
    }

    await article.deleteOne()
    res.json({ message: "Article deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// LIKE / UNLIKE ARTICLE
// ================================
exports.likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    const userId = req.user.id
    const liked = article.likes.includes(userId)

    if (liked) {
      article.likes = article.likes.filter(
        (id) => id.toString() !== userId
      )
    } else {
      article.likes.push(userId)
    }

    await article.save()
    res.json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
