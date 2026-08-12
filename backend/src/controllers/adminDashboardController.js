const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Plant = require('../models/Plant');

// ⚠️ ASSUMPTIONS (same as reports controller) about Order model fields:
//   { items: [{product, name, price, quantity}], total, status, customer, createdAt }
// Aur Customer/Plant models me `createdAt` (timestamps: true se auto aata hai) — agar
// aapke models me timestamps false hain to "this week vs last week" wale growth numbers kaam nahi karenge.

const dayLabel = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });

const pctChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const statusColors = {
  pending: '#f5a623',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#2f9e44',
  completed: '#2f9e44',
  cancelled: '#f43f5e',
};

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
    const twoMonthsAgo = new Date(now); twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);

    // ---------- Top-level totals ----------
    const [totalOrders, totalCustomers, totalPlants] = await Promise.all([
      Order.countDocuments(),
      Customer.countDocuments(),
      Plant.countDocuments(),
    ]);

    const salesAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalSales = salesAgg[0]?.total || 0;

    // ---------- This-week vs last-week comparisons (for the % change badges) ----------
    const [ordersThisWeek, ordersLastWeek] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: weekAgo } }),
      Order.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } }),
    ]);

    const [salesThisWeekAgg, salesLastWeekAgg] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: weekAgo } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    const salesThisWeek = salesThisWeekAgg[0]?.total || 0;
    const salesLastWeek = salesLastWeekAgg[0]?.total || 0;

    const [customersThisWeek, customersLastWeek] = await Promise.all([
      Customer.countDocuments({ createdAt: { $gte: weekAgo } }),
      Customer.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } }),
    ]);

    const [plantsThisWeek, plantsLastWeek] = await Promise.all([
      Plant.countDocuments({ createdAt: { $gte: weekAgo } }),
      Plant.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } }),
    ]);

    // ---------- Daily sales for the last 7 days (line chart) ----------
    const dailyAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
        },
      },
    ]);
    const dailyMap = Object.fromEntries(dailyAgg.map((d) => [d._id, d.sales]));

    const weeklySales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      weeklySales.push({ day: dayLabel(d), sales: dailyMap[key] || 0 });
    }

    // ---------- Order status breakdown (all-time, for the donut) ----------
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const orderStatus = statusAgg.map((s) => ({
      name: (s._id || 'unknown').charAt(0).toUpperCase() + (s._id || 'unknown').slice(1),
      value: s.count,
      color: statusColors[s._id] || '#94a3b8',
    }));

    // ---------- Top selling plants (last 30 days, with change vs previous 30 days) ----------
    const [topThisMonth, topLastMonth] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: monthAgo } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', qty: { $sum: '$items.quantity' } } },
        { $sort: { qty: -1 } },
        { $limit: 4 },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: twoMonthsAgo, $lt: monthAgo } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', qty: { $sum: '$items.quantity' } } },
      ]),
    ]);
    const lastMonthMap = Object.fromEntries(topLastMonth.map((p) => [p._id, p.qty]));
    const topPlants = topThisMonth.map((p) => ({
      name: p._id,
      sales: `${p.qty} Sales`,
      change: pctChange(p.qty, lastMonthMap[p._id] || 0),
    }));

    // ---------- Recent orders / customers ----------
    const recentOrdersRaw = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const recentOrders = recentOrdersRaw.map((o) => ({
      id: `#${o.orderId || o._id}`,
      plant: o.items?.[0]?.name || 'Order',
      amount: `₹${(o.total || 0).toLocaleString()}`,
      status: o.status,
      createdAt: o.createdAt,
    }));

    const recentCustomersRaw = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name email createdAt')
      .lean();
    const recentCustomers = recentCustomersRaw.map((c) => ({
      name: c.name,
      email: c.email,
      createdAt: c.createdAt,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalSales,
          totalCustomers,
          totalPlants,
          ordersChange: pctChange(ordersThisWeek, ordersLastWeek),
          salesChange: pctChange(salesThisWeek, salesLastWeek),
          customersChange: pctChange(customersThisWeek, customersLastWeek),
          plantsChange: pctChange(plantsThisWeek, plantsLastWeek),
        },
        weeklySales,
        orderStatus,
        topPlants,
        recentOrders,
        recentCustomers,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getDashboardStats };