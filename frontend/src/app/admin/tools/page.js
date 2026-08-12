'use client';
import { useState } from 'react';
import {
  Download, Mail, Loader2, CheckCircle2, AlertCircle,
  Package, ShoppingBag, Users, Ticket, Wrench,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const exportTools = [
  { key: 'products', label: 'Export Products', desc: 'Download all products as CSV.', icon: Package },
  { key: 'orders', label: 'Export Orders', desc: 'Download all orders as CSV.', icon: ShoppingBag },
  { key: 'customers', label: 'Export Customers', desc: 'Download all customer records as CSV.', icon: Users },
  { key: 'coupons', label: 'Export Coupons', desc: 'Download all coupons as CSV.', icon: Ticket },
];

export default function ToolsPage() {
  const [exportingKey, setExportingKey] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const downloadExport = async (key) => {
    setExportingKey(key);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/tools/export/${key}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed — check API connection.');
    } finally {
      setExportingKey(null);
    }
  };

  const testEmail = async () => {
    setTestingEmail(true);
    setEmailResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/test-email`);
      const data = await res.json();
      setEmailResult({ success: data.success, message: data.message });
    } catch (err) {
      console.error('Test email error:', err);
      setEmailResult({ success: false, message: 'Network error while testing email' });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Tools</h1>
        <p className="text-slate-500 text-sm">Utilities and maintenance actions.</p>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
        <h3 className="font-semibold text-slate-800 mb-1">Data Export</h3>
        <p className="text-xs text-slate-400 mb-5">Download your store data as CSV files.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {exportTools.map((tool) => {
            const Icon = tool.icon;
            const isExporting = exportingKey === tool.key;
            return (
              <div key={tool.key} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--pa-border)]">
                <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{tool.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                </div>
                <button
                  onClick={() => downloadExport(tool.key)}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-white flex-shrink-0 disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: 'var(--pa-primary)' }}
                >
                  {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isExporting ? 'Exporting' : 'Export'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email configuration test */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
        <h3 className="font-semibold text-slate-800 mb-1">Email Configuration</h3>
        <p className="text-xs text-slate-400 mb-5">Send a test email to verify Resend is configured correctly.</p>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--pa-border)]">
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">Test Email Setup</p>
            <p className="text-xs text-slate-400 mt-0.5">Sends a test email to your configured admin address.</p>
          </div>
          <button
            onClick={testEmail}
            disabled={testingEmail}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-white flex-shrink-0 disabled:opacity-50 transition-colors"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            {testingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />}
            {testingEmail ? 'Testing' : 'Run Test'}
          </button>
        </div>

        {emailResult && (
          <div className={`flex items-start gap-2 text-sm px-3 py-2.5 rounded-lg mt-4 ${
            emailResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {emailResult.success ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            <span>{emailResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}