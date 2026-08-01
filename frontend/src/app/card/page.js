// ============================================
// FILE: src/app/cart/page.js
// ============================================
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, X, Tag, ArrowRight, ShoppingBag, Sprout } from 'lucide-react';

// Dummy cart data — replace with real cart state/API once the backend cart endpoint is ready.
const initialItems = [
  { id: 1, name: 'Monstera Deliciosa', size: '7 inch Pot', price: 899, mrp: 1299, qty: 1, image: '' },
  { id: 2, name: 'Snake Plant', size: '5 inch Pot', price: 499, mrp: 699, qty: 1, image: '' },
  { id: 3, name: 'Peace Lily', size: '7 inch Pot', price: 599, mrp: 999, qty: 1, image: '' },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const updateQty = (id, delta) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const applyCoupon = () => {
    // Placeholder logic — validate against real coupon API later.
    if (couponCode.trim().toUpperCase() === 'PLANT10') {
      setAppliedDiscount(300);
    } else {
      setAppliedDiscount(0);
    }
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - appliedDiscount + shipping;

  return (
    <div className="plant-store min-h-screen bg-[var(--ps-section)] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-[var(--ps-primary)]">Home</Link> / <span className="text-slate-700">Cart</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Cart <span className="text-slate-400 font-normal">({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-16 text-center">
            <ShoppingBag className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-6">Looks like you haven&apos;t added any plants yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--ps-primary)' }}
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ps-border)] divide-y divide-[var(--ps-border)]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="w-20 h-20 rounded-xl bg-[var(--ps-primary-light)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sprout className="w-8 h-8" style={{ color: 'var(--ps-primary)' }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-sm text-slate-400">{item.size}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-slate-800">₹{item.price}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center border border-[var(--ps-border)] rounded-lg">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-20 text-right font-semibold text-slate-800 hidden sm:block">
                    ₹{item.price * item.qty}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-300 hover:text-[var(--ps-sale)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="p-5">
                <Link href="/shop" className="text-sm font-medium" style={{ color: 'var(--ps-primary)' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-6 h-fit sticky top-24">
              <h2 className="font-semibold text-slate-800 mb-4">Order Summary</h2>

              <div className="mb-4">
                <label className="text-sm text-slate-500 mb-2 block">Have a coupon code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--ps-border)] text-slate-600 hover:border-[var(--ps-primary)] hover:text-[var(--ps-primary)]"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-xs mt-1.5" style={{ color: 'var(--ps-primary)' }}>
                    Coupon applied — ₹{appliedDiscount} off!
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm border-t border-[var(--ps-border)] pt-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between" style={{ color: 'var(--ps-primary)' }}>
                    <span>Discount</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-slate-800">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-slate-800 text-base border-t border-[var(--ps-border)] mt-4 pt-4">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-5 flex items-center justify-center gap-2 text-white font-medium py-3 rounded-lg"
                style={{ backgroundColor: 'var(--ps-primary)' }}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}