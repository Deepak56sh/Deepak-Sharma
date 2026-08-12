const mongoose = require('mongoose');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

// ⚠️ ASSUMPTIONS about Order model fields (based on checkout page code you shared earlier):
//   { orderId, customer, items: [{product, name, price, quantity, image}],
//     subtotal, discount, shipping, total, status, createdAt }
// Agar field names alag hain (e.g. `total` ki jagah `totalAmount`), yahan controller me
// wahi jagah badal dena — comments me har jagah maine field name likh diya hai.

const rangeToDate = (range) => {
  const now = new Date();
  const days = { '7d': 7, '30d': 30, '90d': 90 }[range];
  if (!days) return null; // 'all'
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);
  return from;
};

// GET /api/admin/reports/sales?range=30d
const getSalesOverview = async (req, res) => {
  try {
    const range = req.query.range || '30d';
    const fromDate = rangeToDate(range);

    const match = { status: { $ne: 'cancelled' } }; // cancelled orders sales me count nahi karte
    if (fromDate) match.createdAt = { $gte: fromDate };

    const daily = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = daily.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const totalOrders = daily.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    res.json({
      success: true,
      data: {
        range,
        summary: { totalRevenue, totalOrders, avgOrderValue },
        daily: daily.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
      },
    });
  } catch (error) {
    console.error('Sales overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sales overview' });
  }
};

// GET /api/admin/reports/top-products?limit=10&range=30d
const getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const range = req.query.range || '30d';
    const fromDate = rangeToDate(range);

    const match = { status: { $ne: 'cancelled' } };
    if (fromDate) match.createdAt = { $gte: fromDate };

    const topProducts = await Order.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      data: topProducts.map((p) => ({ name: p._id, unitsSold: p.unitsSold, revenue: p.revenue })),
    });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch top products' });
  }
};

// GET /api/admin/reports/order-status
const getOrderStatusBreakdown = async (req, res) => {
  try {
    const breakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = breakdown.reduce((sum, b) => sum + b.count, 0);

    res.json({
      success: true,
      data: breakdown.map((b) => ({
        status: b._id || 'unknown',
        count: b.count,
        percentage: total > 0 ? Math.round((b.count / total) * 100) : 0,
      })),
    });
  } catch (error) {
    console.error('Order status breakdown error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order status breakdown' });
  }
};

// GET /api/admin/reports/coupons
// NOTE: `usedCount` sirf tabhi accurate hoga jab order-placement pe coupon.usedCount++ ho raha ho.
// Filhaal humne wo wire nahi kiya (order controller me coupon code field hi nahi hai) —
// isliye yahan sab coupons ka usedCount abhi 0/stale reh sakta hai jab tak wo connect na ho.
const getCouponUsage = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ usedCount: -1 }).lean();
    res.json({
      success: true,
      data: coupons.map((c) => ({
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        usedCount: c.usedCount,
        usageLimit: c.usageLimit,
        isActive: c.isActive,
      })),
    });
  } catch (error) {
    console.error('Coupon usage error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupon usage' });
  }
};

module.exports = { getSalesOverview, getTopProducts, getOrderStatusBreakdown, getCouponUsage };