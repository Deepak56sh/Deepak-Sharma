const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // e.g. PLTS4872
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
    },
    deliverySlot: String,
    paymentMethod: { type: String, enum: ['card', 'upi', 'cod'], default: 'cod' },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);