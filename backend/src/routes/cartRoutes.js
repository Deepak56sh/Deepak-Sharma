const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const customerAuth = require('../middleware/customerAuth');

router.get('/', customerAuth, getCart);
router.post('/', customerAuth, addToCart);
router.put('/:productId', customerAuth, updateCartItem);
router.delete('/:productId', customerAuth, removeCartItem);
router.delete('/', customerAuth, clearCart);

module.exports = router;