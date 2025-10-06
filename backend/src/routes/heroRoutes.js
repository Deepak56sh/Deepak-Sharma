// backend/src/routes/heroRoutes.js
const express = require('express');
const router = express.Router();
const {
  getHero,
  updateHero
} = require('../controllers/heroController');

// Public routes
router.get('/', getHero);

// Admin routes
router.put('/', updateHero);

module.exports = router;