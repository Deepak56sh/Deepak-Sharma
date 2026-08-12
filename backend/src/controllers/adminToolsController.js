const Plant = require('../models/Plant');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Coupon = require('../models/Coupon');
const { toCSV } = require('../utils/csv');

const sendCSV = (res, filename, csv) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
};

// GET /api/admin/tools/export/products
const exportProducts = async (req, res) => {
  try {
    const products = await Plant.find().lean();
    const rows = products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }));
    const csv = toCSV(rows, ['id', 'name', 'price', 'stock', 'category', 'isActive', 'createdAt']);
    sendCSV(res, `products-${Date.now()}.csv`, csv);
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({ success: false, message: 'Failed to export products' });
  }
};

// GET /api/admin/tools/export/orders
const exportOrders = async (req, res) => {
  try {
    const orders = await Order.find().lean();
    const rows = orders.map((o) => ({
      orderId: o.orderId,
      customer: o.customer,
      itemCount: o.items?.length || 0,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
    }));
    const csv = toCSV(rows, ['orderId', 'customer', 'itemCount', 'subtotal', 'discount', 'shipping', 'total', 'status', 'paymentMethod', 'createdAt']);
    sendCSV(res, `orders-${Date.now()}.csv`, csv);
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to export orders' });
  }
};

// GET /api/admin/tools/export/customers
const exportCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').lean();
    const rows = customers.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
    }));
    const csv = toCSV(rows, ['id', 'name', 'email', 'phone', 'createdAt']);
    sendCSV(res, `customers-${Date.now()}.csv`, csv);
  } catch (error) {
    console.error('Export customers error:', error);
    res.status(500).json({ success: false, message: 'Failed to export customers' });
  }
};

// GET /api/admin/tools/export/coupons
const exportCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().lean();
    const rows = coupons.map((c) => ({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      usedCount: c.usedCount,
      usageLimit: c.usageLimit,
      isActive: c.isActive,
      expiresAt: c.expiresAt,
    }));
    const csv = toCSV(rows, ['code', 'discountType', 'discountValue', 'minOrderValue', 'usedCount', 'usageLimit', 'isActive', 'expiresAt']);
    sendCSV(res, `coupons-${Date.now()}.csv`, csv);
  } catch (error) {
    console.error('Export coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to export coupons' });
  }
};

module.exports = { exportProducts, exportOrders, exportCustomers, exportCoupons };