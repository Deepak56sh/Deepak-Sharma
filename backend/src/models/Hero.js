const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  media: {
    type: String, // Cloudinary URL
    default: ''
  },
  poster: {
    type: String, // video poster image URL
    default: ''
  },
  title: {
    type: String,
    default: 'Bring Nature'
  },
  subtitle: {
    type: String,
    default: 'Into Your Home'
  },
  description: {
    type: String,
    default: ''
  },
  primaryBtn: {
    type: String,
    default: 'Shop Plants'
  },
  primaryBtnLink: {
    type: String,
    default: '/shop'
  },
  secondaryBtn: {
    type: String,
    default: 'Explore Collections'
  },
  secondaryBtnLink: {
    type: String,
    default: '/shop'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const heroSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: 'Free Shipping on orders above ₹999'
    },
    slides: {
      type: [slideSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hero', heroSchema);