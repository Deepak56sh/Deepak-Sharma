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
    enum: ['Code', 'Smartphone', 'Palette', 'Cloud', 'Brain', 'TrendingUp', 'Database', 'Lock', 'Globe', 'Zap'],
    default: 'Code'
  },
  color: {
    type: String,
    required: [true, 'Please provide gradient color'],
    default: 'from-purple-500 to-pink-500'
  },
  features: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
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
    lowercase: true,
    sparse: true
  },
  metaTitle: String,
  metaDescription: String,
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Create slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    // Ensure slug is unique
    const originalSlug = this.slug;
    let counter = 1;
    const checkSlug = async () => {
      const existing = await mongoose.model('Service').findOne({ 
        slug: this.slug, 
        _id: { $ne: this._id } 
      });
      
      if (existing) {
        this.slug = `${originalSlug}-${counter}`;
        counter++;
        await checkSlug();
      } else {
        next();
      }
    };
    
    checkSlug();
  } else {
    next();
  }
});

// Add createdBy before saving
serviceSchema.pre('save', function(next) {
  if (this.isNew && !this.createdBy) {
    this.createdBy = this._conditions?.createdBy;
  }
  next();
});

// Index for better query performance
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Service', serviceSchema);