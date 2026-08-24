'use client';
import { useEffect, useState } from 'react';
import { Loader2, Save, Building2 } from 'lucide-react';
import ImageUploader from '@/components/Imageuploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

const fieldClass =
  'w-full px-3 py-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)] focus:ring-2 focus:ring-[var(--pa-primary)]/10 transition';

export default function BillingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    logoUrl: '',
    bankDetails: '',
    invoicePrefix: 'INV',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/billing/settings`);
        const json = await res.json();
        if (json.success) setForm((prev) => ({ ...prev, ...json.data }));
      } catch (err) {
        setError('Settings load nahi hui');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`${API_URL}/api/billing/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(json.message || 'Save nahi hua');
      }
    } catch (err) {
      setError('Server se connect nahi ho paya');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,var(--pa-primary,#2f9e44) 0%,#14261d 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Billing Settings</h1>
            <p className="text-white/70 text-sm">Yeh details har invoice pe automatically show hongi</p>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {saved && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">Settings save ho gayi ✓</div>}

      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Logo</label>
          <ImageUploader label="" value={form.logoUrl} onChange={(url) => update('logoUrl', url)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name *</label>
            <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="e.g. Plantora Pvt Ltd" className={fieldClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">GST Number</label>
            <input value={form.gstNumber} onChange={(e) => update('gstNumber', e.target.value)} placeholder="e.g. 24ABCDE1234F1Z5" className={fieldClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
          <textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows={2} className={fieldClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input value={form.email} onChange={(e) => update('email', e.target.value)} className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Number Prefix</label>
            <input value={form.invoicePrefix} onChange={(e) => update('invoicePrefix', e.target.value)} placeholder="INV" className={fieldClass} />
            <p className="text-[11px] text-slate-400 mt-1">Bills is prefix ke saath number honge — INV-0001, INV-0002...</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bank Details (optional, PDF pe footer mein aa sakte hain)</label>
          <textarea value={form.bankDetails} onChange={(e) => update('bankDetails', e.target.value)} rows={2} placeholder="A/C No, IFSC, Bank name..." className={fieldClass} />
        </div>
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50"
        style={{ background: 'var(--pa-primary,#2f9e44)' }}
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}