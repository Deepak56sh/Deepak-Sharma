'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Loader2, Receipt, Eye, Trash2, Download } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

export default function InvoicesListPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/billing/invoices`);
      const json = await res.json();
      if (json.success) setInvoices(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, invoiceNumber) => {
    const confirmed = window.confirm(`Invoice "${invoiceNumber}" delete karna hai?`);
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/billing/invoices/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setInvoices((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert('Delete nahi hua');
    }
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = {
    paid: 'bg-green-50 text-green-700',
    unpaid: 'bg-amber-50 text-amber-700',
    draft: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Invoices</h1>
          <p className="text-slate-500 text-sm">{invoices.length} total bills</p>
        </div>
        <Link
          href="/admin/billing/invoices/create"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-md w-fit"
          style={{ background: 'var(--pa-primary,#2f9e44)' }}
        >
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--pa-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--pa-border)]">
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or invoice #..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm w-full focus:outline-none focus:border-[var(--pa-primary)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400"><Loader2 className="w-6 h-6 mx-auto animate-spin" /></td></tr>
              )}

              {!loading && filtered.map((inv) => (
                <tr key={inv._id} className="border-b border-[var(--pa-border)] last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--pa-primary-light,#eaf7ee)' }}>
                        <Receipt className="w-4 h-4" style={{ color: 'var(--pa-primary,#2f9e44)' }} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-800">{inv.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{inv.customerName}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{inv.grandTotal?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[inv.status] || statusStyle.draft}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/billing/invoices/${inv._id}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a href={`${API_URL}/api/billing/invoices/${inv._id}/pdf`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(inv._id, inv.invoiceNumber)} className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Koi invoice nahi mila.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}