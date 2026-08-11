const Cart = require('../models/Cart');
const Plant = require('../models/Plant'); // tumhare product model ka naam — agar alag hai to yahan badal dena

const calcTotal = (items) => items.reduce((sum, it) => sum + it.price * it.quantity, 0);

// ✅ NEW — response me har item ko `_id` field deta hai (= product id)
// Frontend `item._id` isi se update/remove/key ke liye use karta hai
const formatItems = (items) =>
  items.map((it) => ({
    _id: String(it.product),   // 👈 yahi missing piece tha
    product: it.product,
    name: it.name,
    price: it.price,
    image: it.image,
    quantity: it.quantity,
  }));

// GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.customerId });
    if (!cart) cart = { items: [] };
    const items = formatItems(cart.items);
    res.json({ success: true, data: { items, total: calcTotal(items) } });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// POST /api/cart  { productId, quantity }
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

    const product = await Plant.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ customer: req.customerId });
    if (!cart) cart = new Cart({ customer: req.customerId, items: [] });

    const existing = cart.items.find((it) => String(it.product) === String(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0],
        quantity,
      });
    }
    await cart.save();
    const items = formatItems(cart.items);
    res.json({ success: true, data: { items, total: calcTotal(items) } });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

// PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ customer: req.customerId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    if (quantity < 1) {
      cart.items = cart.items.filter((it) => String(it.product) !== String(req.params.productId));
    } else {
      const item = cart.items.find((it) => String(it.product) === String(req.params.productId));
      if (item) item.quantity = quantity;
    }
    await cart.save();
    const items = formatItems(cart.items);
    res.json({ success: true, data: { items, total: calcTotal(items) } });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

// DELETE /api/cart/:productId
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.customerId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((it) => String(it.product) !== String(req.params.productId));
    await cart.save();
    const items = formatItems(cart.items);
    res.json({ success: true, data: { items, total: calcTotal(items) } });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ customer: req.customerId }, { items: [] }, { upsert: true });
    res.json({ success: true, data: { items: [], total: 0 } });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };