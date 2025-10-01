// ============================================
// FILE: nexgen-backend/src/models/Service.js
// ============================================
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  features: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    required: [true, 'Service image URL is required']
  },
  color: {
    type: String,
    default: 'from-purple-500 to-pink-500'
  },
  icon: {
    type: String,
    default: 'Code'
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);
