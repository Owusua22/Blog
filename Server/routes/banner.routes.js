// routes/banner.routes.js
const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload.middleware")
const { protect } = require("../middleware/auth.middleware")
const { adminOnly } = require("../middleware/admin.middleware")

const {
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner
} = require("../controllers/banner.controller")

// ================================
// PUBLIC
// ================================
router.get("/", getBanners)
router.get("/:id", getBanner)

// ================================
// ADMIN PROTECTED
// ================================
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createBanner
)

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateBanner
)

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBanner
)

module.exports = router
