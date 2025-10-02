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

// For internal links, path is required
// For external links, url is required
menuSchema.pre('save', function(next) {
    if (this.type === 'external' && !this.url) {
        return next(new Error('URL is required for external links'));
    }
    if (this.type === 'internal' && !this.path) {
        return next(new Error('Path is required for internal links'));
    }
    next();
});

module.exports = mongoose.model('Menu', menuSchema);