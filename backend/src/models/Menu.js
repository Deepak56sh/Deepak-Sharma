const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu name is required'],
        trim: true,
        maxlength: [50, 'Menu name cannot be more than 50 characters']
    },
    path: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['internal', 'external'],
        default: 'internal'
    },
    url: {
        type: String,
        trim: true,
        default: ''
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    icon: { type: String, trim: true, default: '' }
}, { timestamps: true });

// ✅ pre('save) hook HATA DIYA — validation controller mein ho rahi hai
// Hook wahan bhi fire hota tha jab sirf isActive update hota tha
// aur path empty hone pe fail karta tha

const Menu = mongoose.model('Menu', menuSchema);

// Header model rakhna zaroori hai — baaki files import karti hain
const headerSchema = new mongoose.Schema({
    logoText: { type: String, default: 'Plantora', trim: true },
    logoImage: { type: String, default: '' },
    logoImagePublicId: { type: String, default: '' },
    topBarText: { type: String, default: 'Free Shipping on orders above ₹999' }
}, { timestamps: true });

const Header = mongoose.model('Header', headerSchema);

module.exports = { Menu, Header };