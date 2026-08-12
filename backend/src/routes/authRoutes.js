const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
  updateProfile,
  changePassword,
  uploadProfileImage,
} = require('../controllers/authController');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-profile-image', protect, uploadProfileImage);

module.exports = router;