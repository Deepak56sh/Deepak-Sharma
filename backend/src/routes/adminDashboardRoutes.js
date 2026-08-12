const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'super-admin'), getDashboardStats);

module.exports = router;