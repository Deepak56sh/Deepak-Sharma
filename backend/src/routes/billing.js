const express = require('express');
const router = express.Router();
const BillingSettings = require('../models/BillingSettings');
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/generateInvoicePDF');

/* ---------- Settings (get-or-create singleton) ---------- */
router.get('/settings', async (req, res) => {
  try {
    let settings = await BillingSettings.findOne();
    if (!settings) settings = await BillingSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Settings load nahi hui' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await BillingSettings.findOne();
    if (!settings) settings = new BillingSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Settings save nahi hui' });
  }
});

/* ---------- Invoices CRUD ---------- */
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Invoices load nahi hue' });
  }
});

router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice nahi mila' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const { items = [], taxPercent = 0, discount = 0 } = req.body;
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const taxAmount = ((subtotal - discount) * taxPercent) / 100;
    const grandTotal = subtotal - discount + taxAmount;

    const settings = await BillingSettings.findOne();
    const count = await Invoice.countDocuments();
    const invoiceNumber = `${settings?.invoicePrefix || 'INV'}-${String(count + 1).padStart(4, '0')}`;

    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber,
      subtotal,
      taxAmount,
      grandTotal,
    });
    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Invoice save nahi hua' });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete nahi hua' });
  }
});

/* ---------- PDF download ---------- */
router.get('/invoices/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice nahi mila' });
    const settings = (await BillingSettings.findOne()) || {};

    const pdfBuffer = await generateInvoicePDF({ settings, invoice });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'PDF generate nahi hua' });
  }
});

module.exports = router;