const Media = require('../models/Media');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private/Admin
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image',
      });
    }

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename || req.file.public_id || req.file.publicId,
      resourceType: 'image',
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: media._id,
        url: media.url,
        filename: media.filename,
      },
    });
  } catch (err) {
    // Multer errors (e.g., file too large) come here too
    next(err);
  }
};

// @desc    Upload PDF
// @route   POST /api/upload/pdf
// @access  Private/Admin
exports.uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF',
      });
    }

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename || req.file.public_id || req.file.publicId,
      resourceType: 'pdf',
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: media._id,
        url: media.url,
        filename: media.filename,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
exports.uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one image',
      });
    }

    const mediaPromises = req.files.map((file) =>
      Media.create({
        url: file.path,
        publicId: file.filename || file.public_id || file.publicId,
        resourceType: 'image',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.user.id,
      })
    );

    const mediaFiles = await Promise.all(mediaPromises);

    res.status(200).json({
      success: true,
      data: mediaFiles.map((media) => ({
        id: media._id,
        url: media.url,
        filename: media.filename,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete media
// @route   DELETE /api/upload/:id
// @access  Private/Admin
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.resourceType === 'pdf' ? 'raw' : 'image',
    });

    await media.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all media files
// @route   GET /api/upload/media
// @access  Private/Admin
exports.getMediaFiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, resourceType } = req.query;

    const query = {};
    if (resourceType) {
      query.resourceType = resourceType;
    }

    const media = await Media.find(query)
      .populate('uploadedBy', 'name email')
      .sort('-createdAt')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Media.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: media,
    });
  } catch (err) {
    next(err);
  }
};