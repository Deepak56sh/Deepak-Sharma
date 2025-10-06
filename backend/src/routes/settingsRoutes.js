const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings
} = require('../controllers/settingsController');

// ✅ CORRECTED: Remove duplicate '/settings' from path
router.get('/', getSettings);                         // GET /api/settings
router.put('/', updateSettings);                      // PUT /api/settings

module.exports = router;