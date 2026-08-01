const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getFooter,
  updateFooter,
  uploadFooterLogo
} = require('../controllers/footerController');
const { protect } = require('../middleware/auth');

// Multer setup for logo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'logo-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public route
router.get('/', getFooter);

// Protected routes
router.put('/', protect, updateFooter);
router.post('/logo', protect, upload.single('logo'), uploadFooterLogo);

module.exports = router;