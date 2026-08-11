const Coupon = require('../models/Coupon');

const calcDiscount = (coupon, cartTotal) => {
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  // Discount can never exceed the cart total
  return Math.min(Math.round(discount), cartTotal);
};

// POST /api/coupons/validate   body: { code, cartTotal }
// Public — works for guest carts too, no login required just to check a code.
// NOTE: this only VALIDATES + calculates discount. Actually incrementing `usedCount`
// should happen wherever the order is finally placed (in your order-creation controller),
// otherwise a coupon's usageLimit will never fill up. Add `coupon.usedCount += 1; await coupon.save()`
// there once you send me your order controller.
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });
    if (cartTotal === undefined) return res.status(400).json({ success: false, message: 'cartTotal is required' });

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    }
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Add items worth ₹${coupon.minOrderValue - cartTotal} more to use this coupon`,
      });
    }

    const discount = calcDiscount(coupon, cartTotal);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
};

// GET /api/coupons/my
// NOTE: these coupons are not per-customer assigned (no such field exists yet) —
// this returns all currently usable site-wide coupons. If you want coupons assigned
// to specific customers later, add a `customer` ref field on the Coupon model.
const getMyCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    }).sort({ createdAt: -1 });

    const usable = coupons.filter((c) => !c.usageLimit || c.usedCount < c.usageLimit);

    res.json({ success: true, data: usable });
  } catch (error) {
    console.error('Get my coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

module.exports = { validateCoupon, getMyCoupons };