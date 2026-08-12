const express = require('express');
const router = express.Router();
const {
  getSalesOverview,
  getTopProducts,
  getOrderStatusBreakdown,
  getCouponUsage,
} = require('../controllers/adminReportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/sales', protect, authorize('admin', 'super-admin'), getSalesOverview);
router.get('/top-products', protect, authorize('admin', 'super-admin'), getTopProducts);
router.get('/order-status', protect, authorize('admin', 'super-admin'), getOrderStatusBreakdown);
router.get('/coupons', protect, authorize('admin', 'super-admin'), getCouponUsage);

module.exports = router;