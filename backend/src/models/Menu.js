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
        default: '' // ✅ required hata diya, default empty
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

// ✅ Pre-save validation fix
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

const headerSchema = new mongoose.Schema({
    logoText: { type: String, default: 'Plantora', trim: true },
    logoImage: { type: String, default: '' },
    logoImagePublicId: { type: String, default: '' },
    topBarText: { type: String, default: 'Free Shipping on orders above ₹999' }
}, { timestamps: true });

const Header = mongoose.model('Header', headerSchema);

module.exports = { Menu, Header };