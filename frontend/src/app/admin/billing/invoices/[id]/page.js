'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

export default function ViewInvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/billing/invoices/${id}`);
        const json = await res.json();
        if (json.success) setInvoice(json.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }
  if (!invoice) return <p className="text-slate-500">Invoice nahi mila.</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/billing/invoices')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">{invoice.invoiceNumber}</h1>
        </div>
        <a
          href={`${API_URL}/api/billing/invoices/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-md"
          style={{ background: 'var(--pa-primary,#2f9e44)' }}
        >
          <Download className="w-4 h-4" /> Download PDF
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 space-y-4">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Customer</p>
          <p className="text-slate-800 font-medium">{invoice.customerName}</p>
          <p className="text-sm text-slate-500">{invoice.customerAddress}</p>
        </div>

        <div className="border-t border-[var(--pa-border)] pt-4">
          {invoice.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5">
              <span className="text-slate-600">{item.name} × {item.quantity}</span>
              <span className="text-slate-800 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--pa-border)] pt-4 flex justify-between text-lg font-bold" style={{ color: 'var(--pa-primary,#2f9e44)' }}>
          <span>Total</span><span>₹{invoice.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}