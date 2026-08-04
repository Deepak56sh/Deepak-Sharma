const express = require('express');
const router = express.Router();
const {
  getFooter,
  updateFooter,
  uploadFooterLogo
} = require('../controllers/footerController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload'); // ✅ same multer+Cloudinary middleware used for plants

// Public
router.get('/', getFooter);

// Protected
router.put('/', protect, updateFooter);
router.post('/logo', protect, upload.single('logo'), uploadFooterLogo); // ✅ multer se file aayegi (req.file)

module.exports = router;