// models/Header.js
const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
    logoText: { type: String, default: 'Plantora', trim: true },
    logoImage: { type: String, default: '' },
    logoImagePublicId: { type: String, default: '' },
    topBarText: { type: String, default: 'Free Shipping on orders above ₹999' }
}, { timestamps: true });

module.exports = mongoose.model('Header', headerSchema);