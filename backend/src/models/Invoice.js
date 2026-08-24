const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerAddress: { type: String, default: '' },
    customerGST: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    items: [invoiceItemSchema],
    taxPercent: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'paid', 'unpaid'], default: 'unpaid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);