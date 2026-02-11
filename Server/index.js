require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Routes
const articleRoutes = require("./routes/article.routes")
const bannerRoutes = require("./routes/banner.routes")
const userRoutes = require("./routes/user.routes")
const commentRoutes = require("./routes/comment.routes")
const publicationRoutes = require ("./routes/publication.route")
const biographyRoutes = require ("./routes/biography.routes")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/articles", articleRoutes)
app.use("/api/banners", bannerRoutes)
app.use("/api/users", userRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/publications", publicationRoutes)
app.use("/api/biography", biographyRoutes)

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Blog API running" })
})

// Start server AFTER DB connects
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
