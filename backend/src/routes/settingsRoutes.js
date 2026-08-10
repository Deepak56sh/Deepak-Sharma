const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  uploadSiteLogo,
  uploadSiteFavicon
} = require('../controllers/settingsController');

// GET /api/settings — public (frontend header/footer isse read karega)
router.get('/', getSettings);

// PUT /api/settings — admin only
router.put('/', protect, updateSettings);

// Logo / Favicon uploads — admin only
router.post('/upload-logo', protect, upload.single('logo'), uploadSiteLogo);
router.post('/upload-favicon', protect, upload.single('favicon'), uploadSiteFavicon);

module.exports = router;