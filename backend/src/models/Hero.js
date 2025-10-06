// models/Hero.js
const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: true,
    default: 'Welcome to the Future'
  },
  mainTitle: {
    type: String,
    required: true,
    default: 'Digital Innovation'
  },
  subTitle: {
    type: String,
    required: true,
    default: 'Starts Here'
  },
  description: {
    type: String,
    required: true,
    default: 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience'
  },
  primaryButton: {
    type: String,
    required: true,
    default: 'Explore Services'
  },
  secondaryButton: {
    type: String,
    required: true,
    default: 'Get in Touch'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);