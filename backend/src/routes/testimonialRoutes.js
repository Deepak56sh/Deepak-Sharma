const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // image-only Cloudinary middleware (same one plants use)
const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadTestimonialAvatar
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getTestimonials);

// Admin
router.get('/all', protect, getAllTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

// Cloudinary upload — field name: "avatar"
router.post('/upload', protect, upload.single('avatar'), uploadTestimonialAvatar);

module.exports = router;