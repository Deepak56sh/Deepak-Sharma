const Order = require('../models/Order');

// @desc    Create a new order (customer places order at checkout)
// @route   POST /api/orders
// @access  Private (customer token)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, deliverySlot, paymentMethod, subtotal, discount, shipping, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ success: false, message: 'Shipping details are required' });
    }

    const orderId = 'PLTS' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);

    const order = await Order.create({
      orderId,
      customer: req.customerId,
      items,
      shippingAddress,
      deliverySlot,
      paymentMethod,
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error while placing order' });
  }
};

// @desc    Get logged-in customer's own orders (My Account page)
// @route   GET /api/orders/my
// @access  Private (customer token)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customerId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching orders' });
  }
};

// @desc    Get single order by orderId (thank-you page + order detail)
// @route   GET /api/orders/:id
// @access  Private (customer token) — only their own order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (String(order.customer) !== String(req.customerId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching order' });
  }
};

// @desc    Get ALL orders (admin panel — Orders page)
// @route   GET /api/orders
// @access  Private (admin token)
const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('customer', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching orders' });
  }
};

// @desc    Update order status (admin panel)
// @route   PUT /api/orders/:id/status
// @access  Private (admin token)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Status updated', data: order });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating status' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };