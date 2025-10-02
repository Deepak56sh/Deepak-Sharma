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
  // Logo Section
  logoText: {
    type: String,
    default: 'NexGen'
  },
  description: {
    type: String,
    default: 'Transforming visions into digital reality with cutting-edge technology and stunning design.'
  },

  // Quick Links
  quickLinks: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],

  // Services Links
  serviceLinks: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],

  // Social Links
  socialLinks: [socialLinkSchema],

  // Copyright
  copyrightText: {
    type: String,
    default: 'Made with ❤️'
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Footer', footerSchema);