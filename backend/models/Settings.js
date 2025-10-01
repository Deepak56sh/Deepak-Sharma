//============================================
// FILE: nexgen-backend/src/models/Settings.js
// ============================================
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: String,
  siteTagline: String,
  contactEmail: String,
  contactPhone: String,
  contactAddress: String,
  socialGithub: String,
  socialTwitter: String,
  socialLinkedin: String,
  businessHours: {
    weekdays: String,
    saturday: String,
    sunday: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);
