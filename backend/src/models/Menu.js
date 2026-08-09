// models/Menu.js
const mongoose = require('mongoose');

// ===== MENU SCHEMA =====
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu name is required'],
        trim: true,
        maxlength: [50, 'Menu name cannot be more than 50 characters']
    },
    path: {
        type: String,
        required: [true, 'Menu path is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['internal', 'external'],
        default: 'internal'
    },
    url: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

menuSchema.pre('save', function(next) {
    if (this.type === 'external' && !this.url) {
        return next(new Error('URL is required for external links'));
    }
    if (this.type === 'internal' && !this.path) {
        return next(new Error('Path is required for internal links'));
    }
    next();
});

const Menu = mongoose.model('Menu', menuSchema);

// ===== HEADER SCHEMA (YAHIN HAI - ALAG FILE NAHI) =====
const headerSchema = new mongoose.Schema({
    logoText: {
        type: String,
        default: 'Plantora',
        trim: true
    },
    logoImage: {
        type: String,
        default: ''
    },
    logoImagePublicId: {
        type: String,
        default: ''
    },
    topBarText: {
        type: String,
        default: 'Free Shipping on orders above ₹999'
    }
}, {
    timestamps: true
});

const Header = mongoose.model('Header', headerSchema);

// ===== EXPORT DONO MODELS =====
module.exports = { Menu, Header };