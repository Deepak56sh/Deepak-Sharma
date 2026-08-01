// ============================================
// FILE: src/app/checkout/thank-you/page.js
// ============================================
'use client';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  const orderId = 'PLTS4872'; // TODO: pass the real order id from the checkout response

  return (
    <div className="plant-store min-h-screen bg-[var(--ps-section)] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--ps-primary-light)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9" style={{ color: 'var(--ps-primary)' }} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h1>
        <p className="text-slate-500 text-sm mb-1">Your order has been placed successfully.</p>
        <p className="text-slate-800 font-medium mb-6">Order ID: #{orderId}</p>
        <p className="text-slate-400 text-sm mb-8">
          We have received your order and will send you a confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/account?tab=orders`}
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