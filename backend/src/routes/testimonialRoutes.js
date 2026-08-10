const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getTestimonials,
  getProductReviews,
  getAllTestimonials,
  getPendingTestimonials,
  submitCustomerReview,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
  uploadTestimonialAvatar
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getTestimonials);
router.get('/product/:productId', getProductReviews); // ✅ NEW
router.post('/customer-review', submitCustomerReview);

// Admin routes
router.get('/all', protect, getAllTestimonials);
router.get('/pending', protect, getPendingTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.put('/:id/approve', protect, approveTestimonial);
router.delete('/:id', protect, deleteTestimonial);
router.post('/upload', protect, upload.single('avatar'), uploadTestimonialAvatar);

module.exports = router;