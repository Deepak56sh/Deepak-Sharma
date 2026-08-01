// ============================================
// FILE: src/app/checkout/page.js
// ============================================
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sprout, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const orderItems = [
  { id: 1, name: 'Monstera Deliciosa', size: '7 inch Pot', qty: 1, price: 899 },
  { id: 2, name: 'Snake Plant', size: '5 inch Pot', qty: 1, price: 499 },
  { id: 3, name: 'Peace Lily', size: '7 inch Pot', qty: 1, price: 599 },
];

const steps = [
  { id: 1, label: 'Information' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Payment' },
];

const deliverySlots = [
  { id: 'today', label: 'Today', sub: '10 AM - 1 PM' },
  { id: 'tomorrow', label: 'Tomorrow', sub: '10 AM - 3 PM' },
  { id: 'custom', label: 'Sun, 2 Jun', sub: '10 AM - 1 PM' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState('tomorrow');
  const [payment, setPayment] = useState('card');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '',
  });

  const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const discount = 300;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const placeOrder = (e) => {
    e.preventDefault();
    // TODO: POST to /orders once the backend endpoint exists.
    window.location.href = '/checkout/thank-you';
  };

  return (
    <div className="plant-store min-h-screen bg-[var(--ps-section)] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step >= s.id ? 'text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                  style={step >= s.id ? { backgroundColor: 'var(--ps-primary)' } : undefined}
                >
                  {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-sm font-medium ${step >= s.id ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className="w-10 sm:w-16 h-px bg-[var(--ps-border)] mx-3" />}
            </div>
          ))}
        </div>

        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ps-border)] p-6">
            {/* Step 1: Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--ps-primary)' }} /> Contact Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="fullName" value={form.fullName} onChange={handleChange} required
                      placeholder="Full Name"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    />
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange} required
                      placeholder="Email"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    />
                    <input
                      name="phone" value={form.phone} onChange={handleChange} required
                      placeholder="Phone Number"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)] sm:col-span-2"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-slate-800 mb-4">Shipping Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="address" value={form.address} onChange={handleChange} required
                      placeholder="Address"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)] sm:col-span-2"
                    />
                    <input
                      name="landmark" value={form.landmark} onChange={handleChange}
                      placeholder="Landmark (Optional)"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)] sm:col-span-2"
                    />
                    <input
                      name="city" value={form.city} onChange={handleChange} required
                      placeholder="City"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    />
                    <select
                      name="state" value={form.state} onChange={handleChange} required
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    >
                      <option value="">State</option>
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                    </select>
                    <input
                      name="pincode" value={form.pincode} onChange={handleChange} required
                      placeholder="Pincode"
                      className="p-3 bg-slate-50 border border-[var(--ps-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--ps-primary)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" style={{ color: 'var(--ps-primary)' }} /> Delivery Slot
                </h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {deliverySlots.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSlot(s.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        slot === s.id ? 'border-[var(--ps-primary)] bg-[var(--ps-primary-light)]' : 'border-[var(--ps-border)] hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium text-slate-800 text-sm">{s.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" style={{ color: 'var(--ps-primary)' }} /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'upi', label: 'UPI' },
                    { id: 'cod', label: 'Cash on Delivery' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        payment === m.id ? 'border-[var(--ps-primary)] bg-[var(--ps-primary-light)]' : 'border-[var(--ps-border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                        className="accent-[var(--ps-primary)]"
                      />
                      <span className="text-sm font-medium text-slate-800">{m.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4" /> 100% secure checkout, encrypted payments.
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--ps-border)]">
              {step > 1 ? (
                <button type="button" onClick={goBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
                  ← Back
                </button>
              ) : (
                <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-slate-800">
                  ← Back to Cart
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 text-white font-medium px-6 py-2.5 rounded-lg"
                  style={{ backgroundColor: 'var(--ps-primary)' }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 text-white font-medium px-6 py-2.5 rounded-lg"
                  style={{ backgroundColor: 'var(--ps-primary)' }}
                >
                  Place Order <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-slate-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {orderItems.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--ps-primary-light)] flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-4 h-4" style={{ color: 'var(--ps-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 truncate">{it.name} × {it.qty}</div>
                  </div>
                  <div className="text-sm font-medium text-slate-800">₹{it.price * it.qty}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-[var(--ps-border)] pt-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--ps-primary)' }}>
                <span>Discount (PLANT10)</span>
                <span>-₹{discount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-slate-800">Free</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold text-slate-800 text-base border-t border-[var(--ps-border)] mt-4 pt-4">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}