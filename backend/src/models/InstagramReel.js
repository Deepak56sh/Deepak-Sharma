const mongoose = require('mongoose');

const instagramReelSchema = new mongoose.Schema(
  {
    video: {
      type: String, // Cloudinary video URL
      required: [true, 'Video is required']
    },
    poster: {
      type: String, // optional thumbnail image URL
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String, // optional link to the actual Instagram post
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InstagramReel', instagramReelSchema);