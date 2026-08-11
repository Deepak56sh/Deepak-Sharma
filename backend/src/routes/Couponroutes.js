const express = require('express');
const router = express.Router();
const { validateCoupon, getMyCoupons } = require('../controllers/Couponcontroller');
const customerAuth = require('../middleware/customerAuth');

router.post('/validate', validateCoupon);

router.get('/my', customerAuth, getMyCoupons);

module.exports = router;