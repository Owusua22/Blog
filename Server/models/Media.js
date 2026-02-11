const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['image', 'pdf', 'video'],
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  size: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  usedIn: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Article'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);