const express = require('express');
const router = express.Router();
const {
  getFooter,
  updateFooter,
  uploadFooterLogo
} = require('../controllers/footerController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getFooter);

// Protected
router.put('/', protect, updateFooter);
router.post('/logo', protect, uploadFooterLogo);  // ← multer nahi

module.exports = router;