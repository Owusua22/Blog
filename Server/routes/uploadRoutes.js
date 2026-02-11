const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadImage, uploadPDF } = require('../config/cloudinary');
const uploadController = require('../controllers/uploadController');

// Single image
router.post('/image', protect, uploadImage.single('image'), uploadController.uploadImage);

// Multiple images
router.post('/images', protect, uploadImage.array('images', 10), uploadController.uploadMultipleImages);

// Single PDF
router.post('/pdf', protect, uploadPDF.single('pdf'), uploadController.uploadPDF);

module.exports = router;