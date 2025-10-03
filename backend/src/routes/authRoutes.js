const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getMe,
    logoutAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin);

module.exports = router;