const mongoose = require('mongoose');

// Ek section = ek "block" jaise Hero, Text, Image, Gallery, CTA etc.
// data field flexible hai (Mixed type) taaki har template alag content rakh sake
const sectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['hero', 'text', 'image', 'gallery', 'cta', 'productGrid'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // slug hi URL banega -> /slug
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug sirf lowercase letters, numbers aur hyphen (-) allow karta hai'],
    },
    template: {
      type: String,
      default: 'custom', // e.g. 'hero-text', 'gallery-showcase', 'custom'
    },
    status: {
      type: String,
      enum: ['draft', 'active'],
      default: 'draft',
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
    showInMenu: {
      type: Boolean,
      default: false, // agar true, header menu mein auto show ho sakta hai
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);