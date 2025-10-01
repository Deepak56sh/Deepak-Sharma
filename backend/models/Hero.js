// ============================================
// FILE: nexgen-backend/src/models/Hero.js
// ============================================
import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'Welcome to the Future'
  },
  mainTitle: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  primaryButton: {
    type: String,
    default: 'Explore Services'
  },
  secondaryButton: {
    type: String,
    default: 'Get in Touch'
  }
}, {
  timestamps: true
});

export default mongoose.model('Hero', heroSchema);
