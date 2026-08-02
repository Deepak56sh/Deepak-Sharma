const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: 'Indoor Plants'
    },
    // Shop filters
    plantType: {
      type: String,
      trim: true,
      default: 'Indoor Plants'
    },
    light: {
      type: String,
      enum: ['Low Light', 'Bright Indirect', 'Direct Sunlight', ''],
      default: 'Bright Indirect'
    },
    careLevel: {
      type: String,
      enum: ['Easy', 'Moderate', 'Expert', ''],
      default: 'Easy'
    },
    petFriendly: {
      type: Boolean,
      default: false
    },
    potIncluded: {
      type: Boolean,
      default: true
    },
    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    // Stock
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    // Media
    image: {
      type: String,
      default: ''
    },
    images: [
      {
        type: String
      }
    ],
    // Content
    description: {
      type: String,
      default: ''
    },
    careGuide: {
      light: { type: String, default: '' },
      water: { type: String, default: '' },
      humidity: { type: String, default: '' },
      temperature: { type: String, default: '' },
      soil: { type: String, default: '' }
    },
    sizes: [
      {
        type: String
      }
    ],
    badges: [
      {
        type: String
      }
    ],
    tags: [
      {
        type: String
      }
    ],
    // Flags
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isLowMaintenance: {
      type: Boolean,
      default: false
    },
    isAirPurifying: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Stats (for shop)
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Auto slug from name
plantSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  // Sync category → plantType if empty
  if (!this.plantType && this.category) {
    this.plantType = this.category;
  }
  // inStock from stock
  this.inStock = this.stock > 0;
  // If originalPrice not set, use price
  if (!this.originalPrice || this.originalPrice < this.price) {
    this.originalPrice = this.price;
  }
  // Main image into images array
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
  next();
});

module.exports = mongoose.model('Plant', plantSchema);