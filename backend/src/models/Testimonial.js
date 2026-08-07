const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    role: {
      type: String, // e.g. city or job title
      trim: true,
      default: ''
    },
    avatar: {
      type: String, // Cloudinary image URL
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required']
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

module.exports = mongoose.model('Testimonial', testimonialSchema);