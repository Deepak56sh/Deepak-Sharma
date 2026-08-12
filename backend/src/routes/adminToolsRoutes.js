const express = require('express');
const router = express.Router();
const {
  exportProducts,
  exportOrders,
  exportCustomers,
  exportCoupons,
} = require('../controllers/adminToolsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/export/products', protect, authorize('admin', 'super-admin'), exportProducts);
router.get('/export/orders', protect, authorize('admin', 'super-admin'), exportOrders);
router.get('/export/customers', protect, authorize('admin', 'super-admin'), exportCustomers);
router.get('/export/coupons', protect, authorize('admin', 'super-admin'), exportCoupons);

module.exports = router;