const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['github', 'twitter', 'linkedin', 'email', 'facebook', 'instagram', 'youtube']
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

const footerSchema = new mongoose.Schema({
  // Logo
  logoText: {
    type: String,
    default: 'Plantora'
  },
  logoImage: {
    type: String, // /uploads/logo-xxx.png
    default: ''
  },
  description: {
    type: String,
    default: 'Bringing nature closer to home. Premium plants carefully packed and delivered to your door.'
  },

  // Quick Links
  quickLinks: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],

  // Collections (purane serviceLinks ko collections naam diya — same kaam)
  serviceLinks: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],

  // Customer Care links
  customerCare: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],

  // Social Links
  socialLinks: [socialLinkSchema],

  // Copyright
  copyrightText: {
    type: String,
    default: 'All rights reserved.'
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Footer', footerSchema);