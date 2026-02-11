const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  updateUser
} = require("../controllers/user.controller")

const { protect } = require("../middleware/auth.middleware")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.post("/admin/register", registerAdmin)
router.post("/admin/login", loginAdmin)

router.put("/profile", protect, updateUser)

module.exports = router
