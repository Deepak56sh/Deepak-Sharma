const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const customerAuth = require('../middleware/customerAuth');
const { protect } = require('../middleware/auth'); // admin token middleware, jaisa customer routes me use ho raha hai

// Customer (shop) routes
router.post('/', customerAuth, createOrder);
router.get('/my', customerAuth, getMyOrders);
router.get('/:id', customerAuth, getOrderById);

// Admin routes
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;