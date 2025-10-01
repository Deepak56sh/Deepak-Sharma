// ============================================
// FILE: nexgen-backend/src/models/About.js
// ============================================
import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  mainHeading: String,
  description1: String,
  description2: String,
  stats: [{
    number: String,
    label: String
  }],
  values: [{
    title: String,
    description: String,
    emoji: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);
