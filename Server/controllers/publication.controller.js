const Publication = require("../models/Publication")
const cloudinary = require("../config/cloudinary")
const fs = require("fs")
const path = require("path")

// Helper: Remove local file safely
const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

// Helper: Generate inline preview URL
const generateInlineUrl = (publicId) => {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/fl_attachment:false/${publicId}.pdf`
}

//
// ================================
// CREATE PUBLICATION
// ================================
//
exports.createPublication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" })
    }

    if (!req.body.title) {
      removeLocalFile(req.file.path)
      return res.status(400).json({ message: "Title is required" })
    }

    // Upload as RAW (correct for PDFs)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "publications",
      resource_type: "raw"
    })

    const inlineUrl = generateInlineUrl(result.public_id)

    const publication = await Publication.create({
      title: req.body.title,
      description: req.body.description || "",
      uploadedBy: req.user.id,
      file: {
        url: inlineUrl,
        publicId: result.public_id
      }
    })

    removeLocalFile(req.file.path)

    res.status(201).json(publication)

  } catch (error) {
    console.error("CREATE PUBLICATION ERROR:", error)
    if (req.file) removeLocalFile(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

//
// ================================
// GET ALL PUBLICATIONS
// ================================
//
exports.getPublications = async (req, res) => {
  try {
    const publications = await Publication.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json(publications)

  } catch (error) {
    console.error("GET PUBLICATIONS ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

//
// ================================
// GET SINGLE PUBLICATION
// ================================
//
exports.getPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
      .populate("uploadedBy", "name email")

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    res.status(200).json(publication)

  } catch (error) {
    console.error("GET PUBLICATION ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

//
// ================================
// UPDATE PUBLICATION
// ================================
//
exports.updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)

    if (!publication) {
      if (req.file) removeLocalFile(req.file.path)
      return res.status(404).json({ message: "Publication not found" })
    }

    // Replace PDF if new file uploaded
    if (req.file) {

      // Delete old file from Cloudinary
      if (publication.file?.publicId) {
        await cloudinary.uploader.destroy(publication.file.publicId, {
          resource_type: "raw"
        })
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "publications",
        resource_type: "raw"
      })

      const inlineUrl = generateInlineUrl(result.public_id)

      publication.file = {
        url: inlineUrl,
        publicId: result.public_id
      }

      removeLocalFile(req.file.path)
    }

    publication.title = req.body.title ?? publication.title
    publication.description = req.body.description ?? publication.description

    await publication.save()

    res.status(200).json(publication)

  } catch (error) {
    console.error("UPDATE PUBLICATION ERROR:", error)
    if (req.file) removeLocalFile(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

//
// ================================
// DELETE PUBLICATION
// ================================
//
exports.deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    // Delete from Cloudinary
    if (publication.file?.publicId) {
      await cloudinary.uploader.destroy(publication.file.publicId, {
        resource_type: "raw"
      })
    }

    await publication.deleteOne()

    res.status(200).json({ message: "Publication deleted successfully" })

  } catch (error) {
    console.error("DELETE PUBLICATION ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}
