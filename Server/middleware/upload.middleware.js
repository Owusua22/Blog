// middleware/upload.middleware.js
const multer = require("multer")

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf"
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error("Only images (jpg, png, webp) and PDF files are allowed"),
        false
      )
    }
  }
})

module.exports = upload
