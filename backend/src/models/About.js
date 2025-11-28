// models/About.js - ONLY TEAM IMAGE
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'About Us'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'Crafting digital experiences that inspire and innovate'
  },
  mainHeading: {
    type: String,
    required: true,
    default: 'We Build Digital Dreams'
  },
  description1: {
    type: String,
    required: true
  },
  description2: {
    type: String,
    required: true
  },
  // ✅ ONLY ONE IMAGE FIELD - Team Image
  teamImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
  },
  stats: [{
    number: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }],
  values: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    emoji: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);