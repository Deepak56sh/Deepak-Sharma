const Coupon = require('../models/Coupon');

// GET /api/admin/coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// POST /api/admin/coupons
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, maxDiscount, minOrderValue, usageLimit, expiresAt, isActive } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ success: false, message: 'code, discountType and discountValue are required' });
    }

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      maxDiscount: maxDiscount || null,
      minOrderValue: minOrderValue || 0,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

// PUT /api/admin/coupons/:id
const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, maxDiscount, minOrderValue, usageLimit, expiresAt, isActive } = req.body;

    if (code) {
      const existing = await Coupon.findOne({ code: code.trim().toUpperCase(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        ...(code && { code: code.trim().toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue }),
        ...(maxDiscount !== undefined && { maxDiscount: maxDiscount || null }),
        ...(minOrderValue !== undefined && { minOrderValue }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit || null }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt || null }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
};

// PATCH /api/admin/coupons/:id/toggle
const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle coupon' });
  }
};

// DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};

module.exports = { getAllCoupons, createCoupon, updateCoupon, toggleCoupon, deleteCoupon };