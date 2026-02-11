require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const articleRoutes = require("./routes/article.routes");
const bannerRoutes = require("./routes/banner.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");
const publicationRoutes = require("./routes/publication.route");
const biographyRoutes = require("./routes/biography.routes");

const app = express();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// =====================
// Routes
// =====================
app.use("/api/articles", articleRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/biography", biographyRoutes);

// =====================
// Health Check Route
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Blog API is running",
  });
});

// =====================
// Server & Database Start
// =====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1); // Exit if DB fails
  }
};

startServer();
