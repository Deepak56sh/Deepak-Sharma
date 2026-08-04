'use client';
import { useState, useEffect } from 'react';
import { UserCog, Search, Trash2, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function UsersRolesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [busyId, setBusyId] = useState(null); // tracks which row is mid-action

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const fetchCustomers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers(data.data || []);
      } else {
        setErrorMsg(data.message || 'Failed to load customers');
      }
    } catch (err) {
      console.error('Fetch customers error:', err);
      setErrorMsg('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleStatus = async (customer) => {
    setBusyId(customer._id);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/customers/${customer._id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === customer._id ? { ...c, isActive: !c.isActive } : c))
        );
      } else {
        setErrorMsg(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not reach the server.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer account? This cannot be undone.')) return;
    setBusyId(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers((prev) => prev.filter((c) => c._id !== id));
      } else {
        setErrorMsg(data.message || 'Failed to delete customer');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not reach the server.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <UserCog className="w-6 h-6" style={{ color: 'var(--pa-primary)' }} />
            Users & Roles
          </h1>
          <p className="text-slate-500 text-sm">Customers who registered on the shop.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--pa-border)]">
        <div className="p-4 border-b border-[var(--pa-border)] flex items-center justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm w-full focus:outline-none focus:border-[var(--pa-primary)]"
            />
          </div>
          <span className="text-sm text-slate-400">{filtered.length} customer(s)</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer._id} className="border-b border-[var(--pa-border)] last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-500">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-500">{customer.phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        customer.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {customer.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(customer)}
                        disabled={busyId === customer._id}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-50"
                        title={customer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {customer.isActive ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        disabled={busyId === customer._id}
                        className="p-2 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-500 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}