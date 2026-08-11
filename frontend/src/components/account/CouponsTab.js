'use client';
import { useState, useEffect } from 'react';
import { Ticket, Copy, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// ⚠️ ASSUMED ROUTE — coupon backend abhi baaki hai, is se badal jayega:
//   GET /api/coupons/my -> { success, data: [ {_id, code, discountType, discountValue, minOrderValue, expiresAt} ] }

export default function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/coupons/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoupons(data.success ? data.data : []);
    } catch (err) {
      console.error('Fetch coupons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8ece9] p-16 text-center">
        <Ticket className="w-14 h-14 text-slate-200 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[#14261d] mb-1">No coupons available</h2>
        <p className="text-[#6b7280] text-sm">Check back later for offers and discounts.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {coupons.map((c) => (
        <div key={c._id} className="bg-white rounded-2xl border border-dashed border-[#2f9e44]/40 p-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#6b7280] mb-1">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
              </p>
              <p className="font-mono font-bold text-lg text-[#14261d] tracking-wide">{c.code}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eaf7ee] flex items-center justify-center">
              <Ticket className="w-5 h-5 text-[#2f9e44]" />
            </div>
          </div>

          {c.minOrderValue > 0 && (
            <p className="text-xs text-[#6b7280] mt-2">Min. order ₹{c.minOrderValue}</p>
          )}
          {c.expiresAt && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Valid till {new Date(c.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}

          <button
            onClick={() => copyCode(c.code)}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg border border-[#e8ece9] text-[#4b5563] hover:border-[#2f9e44] hover:text-[#2f9e44] transition-colors"
          >
            {copiedCode === c.code ? (
              <><Check className="w-4 h-4" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Code</>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}