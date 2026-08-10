// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Plantora'
  },
  siteTagline: {
    type: String,
    default: 'Bring Nature Home'
  },
  siteUrl: {
    type: String,
    default: ''
  },
  // ✅ NEW — shown in header/navbar
  siteLogo: {
    type: String,
    default: ''
  },
  // ✅ NEW — shown in browser tab
  siteFavicon: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'hello@plantora.com'
  },
  contactPhone: {
    type: String,
    required: true,
    default: '+91 98765 43210'
  },
  contactAddress: {
    type: String,
    required: true,
    default: 'Ahmedabad, Gujarat'
  },
  socialGithub: {
    type: String,
    default: ''
  },
  socialTwitter: {
    type: String,
    default: ''
  },
  socialLinkedin: {
    type: String,
    default: ''
  },
  socialInstagram: {
    type: String,
    default: ''
  },
  socialFacebook: {
    type: String,
    default: ''
  },
  businessHours: {
    weekdays: {
      type: String,
      default: '9:00 AM - 6:00 PM'
    },
    saturday: {
      type: String,
      default: '10:00 AM - 4:00 PM'
    },
    sunday: {
      type: String,
      default: 'Closed'
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);