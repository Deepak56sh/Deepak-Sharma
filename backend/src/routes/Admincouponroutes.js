const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
} = require('../controllers/Admincouponcontroller');


const { protect } = require('../middleware/auth');

router.get('/', protect, getAllCoupons);
router.post('/', protect, createCoupon);
router.put('/:id', protect, updateCoupon);
router.patch('/:id/toggle', protect, toggleCoupon);
router.delete('/:id', protect, deleteCoupon);

module.exports = router;