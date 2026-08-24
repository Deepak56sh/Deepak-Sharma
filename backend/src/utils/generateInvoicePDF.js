const puppeteer = require('puppeteer');

// Ek clean, professional invoice HTML template — dynamic data yahan inject hota hai
function buildInvoiceHTML({ settings, invoice }) {
  const itemsRows = invoice.items
    .map(
      (item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">₹${item.price.toFixed(2)}</td>
        <td style="text-align:right">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; font-family: 'Helvetica', Arial, sans-serif; }
      body { padding: 40px; color: #14261d; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2f9e44; padding-bottom: 20px; margin-bottom: 24px; }
      .logo { max-height: 60px; max-width: 180px; object-fit: contain; }
      .company-name { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
      .muted { color: #6b7280; font-size: 12px; line-height: 1.5; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { font-size: 26px; margin: 0; color: #2f9e44; letter-spacing: 1px; }
      .meta-grid { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 20px; }
      .meta-box h4 { font-size: 11px; text-transform: uppercase; color: #6b7280; margin: 0 0 6px; letter-spacing: 0.5px; }
      .meta-box p { margin: 0; font-size: 13px; line-height: 1.6; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      thead th { background: #f6f8f7; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e8ece9; }
      tbody td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e8ece9; }
      .totals { width: 280px; margin-left: auto; }
      .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
      .totals .grand { font-weight: 700; font-size: 16px; color: #2f9e44; border-top: 2px solid #14261d; margin-top: 6px; padding-top: 10px; }
      .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        ${settings.logoUrl ? `<img class="logo" src="${settings.logoUrl}" />` : ''}
        <p class="company-name">${settings.companyName || ''}</p>
        <p class="muted">${settings.address || ''}</p>
        <p class="muted">${settings.gstNumber ? `GSTIN: ${settings.gstNumber}` : ''}</p>
        <p class="muted">${settings.phone || ''} ${settings.email ? '· ' + settings.email : ''}</p>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <p class="muted">#${invoice.invoiceNumber}</p>
        <p class="muted">${new Date(invoice.date).toLocaleDateString('en-IN')}</p>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <h4>Billed To</h4>
        <p>${invoice.customerName}</p>
        <p class="muted">${invoice.customerAddress || ''}</p>
        <p class="muted">${invoice.customerGST ? `GSTIN: ${invoice.customerGST}` : ''}</p>
        <p class="muted">${invoice.customerPhone || ''}</p>
      </div>
      <div class="meta-box">
        <h4>Status</h4>
        <p style="text-transform:capitalize">${invoice.status}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr><th>#</th><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>₹${invoice.subtotal.toFixed(2)}</span></div>
      ${invoice.discount ? `<div><span>Discount</span><span>-₹${invoice.discount.toFixed(2)}</span></div>` : ''}
      <div><span>Tax (${invoice.taxPercent}%)</span><span>₹${invoice.taxAmount.toFixed(2)}</span></div>
      <div class="grand"><span>Total</span><span>₹${invoice.grandTotal.toFixed(2)}</span></div>
    </div>

    ${invoice.notes ? `<p class="muted">Note: ${invoice.notes}</p>` : ''}

    <div class="footer">Thank you for your business — ${settings.companyName || ''}</div>
  </body>
  </html>`;
}

async function generateInvoicePDF({ settings, invoice }) {
  const html = buildInvoiceHTML({ settings, invoice });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Render/production ke liye zaroori
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px' } });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = { generateInvoicePDF };