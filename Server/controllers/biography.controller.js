const Biography = require("../models/Biography");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ================================
// GET ALL BIOGRAPHIES
// ================================
exports.getBiography = async (req, res) => {
  try {
    const bios = await Biography.find().sort({ createdAt: -1 });
    res.status(200).json(bios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// CREATE BIOGRAPHY
// ================================
exports.createBiography = async (req, res) => {
  try {
    const { title, sections } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const data = {
      title,
      sections: sections ? JSON.parse(sections) : [],
      createdBy: req.user.id,
    };

    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "biographies",
      });
      data.profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(req.file.path);
    }

    const bio = await Biography.create(data);
    res.status(201).json(bio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// UPDATE BIOGRAPHY
// ================================
exports.updateBiography = async (req, res) => {
  try {
    const bio = await Biography.findById(req.params.id);
    if (!bio) return res.status(404).json({ message: "Biography not found" });

    const { title, sections } = req.body;

    if (title) bio.title = title;
    if (sections) bio.sections = typeof sections === "string" ? JSON.parse(sections) : sections;

    // Handle profile image update
    if (req.file) {
      // Remove old image
      if (bio.profileImage?.publicId) {
        await cloudinary.uploader.destroy(bio.profileImage.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "biographies",
      });
      bio.profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(req.file.path);
    }

    await bio.save();
    res.status(200).json(bio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// DELETE BIOGRAPHY
// ================================
exports.deleteBiography = async (req, res) => {
  try {
    const bio = await Biography.findById(req.params.id);
    if (!bio) return res.status(404).json({ message: "Biography not found" });

    // Delete image from Cloudinary
    if (bio.profileImage?.publicId) {
      await cloudinary.uploader.destroy(bio.profileImage.publicId);
    }

    await bio.deleteOne();
    res.status(200).json({ message: "Biography deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
