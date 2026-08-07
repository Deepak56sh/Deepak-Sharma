const express = require('express');
const router = express.Router();
const uploadHero = require('../middleware/uploadHero'); // same image+video Cloudinary middleware used for Hero
const {
  getReels,
  getAllReels,
  createReel,
  updateReel,
  deleteReel,
  uploadReelMedia
} = require('../controllers/instagramController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getReels);

// Admin
router.get('/all', protect, getAllReels);
router.post('/', protect, createReel);
router.put('/:id', protect, updateReel);
router.delete('/:id', protect, deleteReel);

// Cloudinary upload — field name: "media" (video, or poster image)
router.post('/upload', protect, uploadHero.single('media'), uploadReelMedia);

module.exports = router;