'use client';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ps-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="plant-store min-h-screen bg-[var(--ps-section)] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--ps-primary-light)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9" style={{ color: 'var(--ps-primary)' }} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h1>
        <p className="text-slate-500 text-sm mb-1">Your order has been placed successfully.</p>
        <p className="text-slate-800 font-medium mb-1">Order ID: #{orderId || order?.orderId}</p>
        {order && (
          <p className="text-slate-800 font-semibold mb-4">Total: ₹{order.total?.toLocaleString()}</p>
        )}
        <p className="text-slate-400 text-sm mb-8">
          We have received your order and will send you a confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account"
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: 'var(--ps-primary)' }}
          >
            Track Your Order
          </Link>
          <Link href="/shop" className="px-6 py-3 rounded-lg font-medium border border-[var(--ps-border)] text-slate-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}