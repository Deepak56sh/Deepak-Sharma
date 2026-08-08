// routes/headerRoutes.js
const express = require('express');
const router = express.Router();
const {
    getHeader,
    updateHeader,
    deleteLogo
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route - get header data
router.get('/', getHeader);

// Protected routes - admin only
router.put('/', protect, upload.single('logoImage'), updateHeader);
router.delete('/logo', protect, deleteLogo);

module.exports = router;