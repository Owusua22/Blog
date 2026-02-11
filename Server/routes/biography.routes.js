const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const {
  getBiography,
  createBiography,
  updateBiography,
  deleteBiography,
} = require("../controllers/biography.controller");

// PUBLIC
// GET the latest biography
router.get("/", getBiography);

// POST new biography (admin only)
router.post("/", protect, upload.single("image"), createBiography);

// PUT update biography
router.put("/:id", protect, upload.single("image"), updateBiography);

// DELETE biography
router.delete("/:id", protect, deleteBiography);

module.exports = router;