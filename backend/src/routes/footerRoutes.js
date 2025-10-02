const express = require('express');
const router = express.Router();
const {
  getFooter,
  updateFooter
} = require('../controllers/footerController');
const { protect } = require('../middleware/auth');

// Public route
router.get('/', getFooter);

// Protected route
router.put('/', protect, updateFooter);

module.exports = router;