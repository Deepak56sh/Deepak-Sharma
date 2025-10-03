// ============================================
// FILE: models/Service.js
// ============================================
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide service title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Please provide service image URL']
  },
  icon: {
    type: String,
    required: [true, 'Please provide icon name'],
    enum: ['Code', 'Smartphone', 'Palette', 'Cloud', 'Brain', 'TrendingUp', 'Database', 'Lock', 'Globe', 'Zap']
  },
  color: {
    type: String,
    required: [true, 'Please provide gradient color'],
    default: 'from-purple-500 to-pink-500'
  },
  features: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['Development', 'Design', 'Marketing', 'Cloud', 'AI', 'Other'],
    default: 'Other'
  },
  price: {
    type: String,
    default: 'Contact for pricing'
  },
  duration: {
    type: String,
    default: 'Varies'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);