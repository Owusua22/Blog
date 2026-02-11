// controllers/banner.controller.js
const Banner = require("../models/Banner")
const cloudinary = require("../config/cloudinary")
const fs = require("fs")

// ================================
// CREATE BANNER
// ================================
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners"
    })

    const banner = await Banner.create({
      title: req.body.title,
     
      image: {
        url: result.secure_url,
        publicId: result.public_id
      }
    })

    fs.unlinkSync(req.file.path)

    res.status(201).json(banner)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// GET ALL BANNERS
// ================================
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 })
    res.json(banners)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// GET SINGLE BANNER
// ================================
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" })
    }
    res.json(banner)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// UPDATE BANNER
// ================================
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" })
    }

    // Replace image if new one uploaded
    if (req.file) {
      if (banner.image?.publicId) {
        await cloudinary.uploader.destroy(banner.image.publicId)
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "banners"
      })

      banner.image = {
        url: result.secure_url,
        publicId: result.public_id
      }

      fs.unlinkSync(req.file.path)
    }

    banner.title = req.body.title ?? banner.title
    banner.link = req.body.link ?? banner.link

    await banner.save()
    res.json(banner)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================================
// DELETE BANNER
// ================================
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" })
    }

    if (banner.image?.publicId) {
      await cloudinary.uploader.destroy(banner.image.publicId)
    }

    await banner.deleteOne()
    res.json({ message: "Banner deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
