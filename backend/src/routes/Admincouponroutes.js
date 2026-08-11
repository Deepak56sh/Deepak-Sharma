const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
} = require('../controllers/Admincouponcontroller');

const adminAuth = require('../middleware/adminAuth');

router.get('/', adminAuth, getAllCoupons);
router.post('/', adminAuth, createCoupon);
router.put('/:id', adminAuth, updateCoupon);
router.patch('/:id/toggle', adminAuth, toggleCoupon);
router.delete('/:id', adminAuth, deleteCoupon);

module.exports = router;