// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'NexGen'
  },
  siteTagline: {
    type: String,
    default: 'Digital Innovation'
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'hello@nexgen.com'
  },
  contactPhone: {
    type: String,
    required: true,
    default: '+1 (555) 123-4567'
  },
  contactAddress: {
    type: String,
    required: true,
    default: 'San Francisco, CA'
  },
  socialGithub: {
    type: String,
    default: 'https://github.com/nexgen'
  },
  socialTwitter: {
    type: String,
    default: 'https://twitter.com/nexgen'
  },
  socialLinkedin: {
    type: String,
    default: 'https://linkedin.com/company/nexgen'
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