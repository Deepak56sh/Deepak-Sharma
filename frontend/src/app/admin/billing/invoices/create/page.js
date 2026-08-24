'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

const fieldClass =
  'w-full px-3 py-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)] focus:ring-2 focus:ring-[var(--pa-primary)]/10 transition';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGST, setCustomerGST] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [taxPercent, setTaxPercent] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };
  const addItem = () => setItems((prev) => [...prev, { name: '', quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const taxAmount = ((subtotal - discount) * taxPercent) / 100;
  const grandTotal = subtotal - discount + taxAmount;

  const handleSave = async () => {
    if (!customerName.trim()) {
      setError('Customer name zaroori hai');
      return;
    }
    if (!items.length || items.some((it) => !it.name.trim())) {
      setError('Har item ka naam bharna zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/billing/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName, customerAddress, customerGST, customerPhone,
          items, taxPercent: Number(taxPercent), discount: Number(discount), notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/admin/billing/invoices/${json.data._id}`);
      } else {
        setError(json.message || 'Save nahi hua');
      }
    } catch (err) {
      setError('Server se connect nahi ho paya');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/admin/billing/invoices')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Naya Bill Banao</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {/* Customer details */}
      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Customer Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Customer Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={fieldClass} />
          <input placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={fieldClass} />
        </div>
        <textarea placeholder="Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className={fieldClass} />
        <input placeholder="Customer GST (optional)" value={customerGST} onChange={(e) => setCustomerGST(e.target.value)} className={fieldClass} />
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Items</h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-slate-50 rounded-xl p-3">
              <input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
              />
              <input
                type="number" min="1" placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                className="w-full sm:w-20 px-3 py-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
              />
              <input
                type="number" min="0" placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                className="w-full sm:w-28 px-3 py-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
              />
              <div className="w-full sm:w-24 text-right text-sm font-semibold text-slate-700">
                ₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
              </div>
              <button onClick={() => removeItem(index)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--pa-border)] rounded-lg hover:bg-slate-50 text-slate-600">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      {/* Tax / discount / totals */}
      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tax %</label>
            <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Discount (₹)</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className={fieldClass} />
          </div>
        </div>
        <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={fieldClass} />

        <div className="border-t border-[var(--pa-border)] pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {discount > 0 && <div className="flex justify-between text-slate-500"><span>Discount</span><span>-₹{Number(discount).toFixed(2)}</span></div>}
          <div className="flex justify-between text-slate-500"><span>Tax ({taxPercent}%)</span><span>₹{taxAmount.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--pa-border)]" style={{ color: 'var(--pa-primary,#2f9e44)' }}>
            <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50"
        style={{ background: 'var(--pa-primary,#2f9e44)' }}
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Saving...' : 'Generate Invoice'}
      </button>
    </div>
  );
}