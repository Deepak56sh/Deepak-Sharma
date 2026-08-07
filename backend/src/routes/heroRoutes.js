const express = require('express');
const router = express.Router();
const uploadHero = require('../middleware/uploadHero'); 
const { getHero, updateHero, uploadHeroMedia } = require('../controllers/heroController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getHero);

// Admin
router.put('/', protect, updateHero);

// Cloudinary upload — field name: "media" (image or video)
router.post('/upload', protect, uploadHero.single('media'), uploadHeroMedia);

module.exports = router;