const express = require('express');
const router = express.Router();
const {
  getReels,
  getAllReels,
  createReel,
  updateReel,
  deleteReel,
  uploadReelMedia  // ← Make sure this is imported
} = require('../controllers/instagramController');
const uploadHero = require('../middleware/uploadHero'); // ← Import your multer config

// Public routes
router.get('/', getReels);

// Admin routes
router.get('/all', getAllReels);
router.post('/', createReel);
router.put('/:id', updateReel);
router.delete('/:id', deleteReel);

// ✅ ADD THIS ROUTE - Upload route
router.post('/upload', uploadHero.single('media'), uploadReelMedia);

module.exports = router;