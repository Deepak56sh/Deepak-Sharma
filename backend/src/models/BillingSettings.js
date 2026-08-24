const mongoose = require('mongoose');

const billingSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    bankDetails: { type: String, default: '' }, // optional: account no, IFSC, etc.
    invoicePrefix: { type: String, default: 'INV' }, // e.g. INV-0001
  },
  { timestamps: true }
);

// Singleton pattern — sirf ek hi settings document rahega
module.exports = mongoose.model('BillingSettings', billingSettingsSchema);