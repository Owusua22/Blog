const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload.middleware")
const { protect } = require("../middleware/auth.middleware")

const {
  createPublication,
  getPublications,
  getPublication,
  updatePublication,
  deletePublication
} = require("../controllers/publication.controller")

router.get("/", getPublications)
router.get("/:id", getPublication)

router.post("/", protect, upload.single("file"), createPublication)
router.put("/:id", protect, upload.single("file"), updatePublication)
router.delete("/:id", protect, deletePublication)

module.exports = router
