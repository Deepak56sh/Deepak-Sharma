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
        default: ''        // ✅ required NAHI — external links mein path nahi hota
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
        trim: true,
        default: ''
    }
}, { timestamps: true });


module.exports = mongoose.model('Menu', menuSchema);