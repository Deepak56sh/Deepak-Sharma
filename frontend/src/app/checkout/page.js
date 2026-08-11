'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Sprout, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

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
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ NEW
  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState('tomorrow');
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false); // ✅ NEW
  const [orderError, setOrderError] = useState(''); // ✅ NEW
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '',
  });

  // ✅ NEW — checkout se pehle login zaroori
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/checkout');
      return;
    }
    // agar login hai to user ka naam/email/phone form me pre-fill kar do
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setForm((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    } catch {}
    setCheckingAuth(false);
  }, [router]);

  const subtotal = cartTotal;
  const discount = 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // ✅ CHANGED — real backend order create
  const placeOrder = async (e) => {
    e.preventDefault();
    setOrderError('');
    setPlacing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map((it) => ({
            product: it._id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            image: it.image,
          })),
          shippingAddress: form,
          deliverySlot: slot,
          paymentMethod: payment,
          subtotal,
          discount,
          shipping,
          total,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await clearCart();
        router.push(`/checkout/thank-you?orderId=${data.data.orderId}`);
      } else {
        setOrderError(data.message || 'Order place nahi ho paya, dobara try karo');
      }
    } catch (err) {
      console.error(err);
      setOrderError('Network error — order place nahi ho paya');
    } finally {
      setPlacing(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="plant-store min-h-screen bg-[var(--ps-section)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Your cart is empty.</p>
          <Link href="/shop" className="px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: 'var(--ps-primary)' }}>
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-store min-h-screen bg-[var(--ps-section)] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s.id ? 'text-white' : 'bg-slate-100 text-slate-400'
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

        {orderError && (
          <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {orderError}
          </div>
        )}

        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ps-border)] p-6">
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
                      className={`p-4 rounded-xl border text-left transition-all ${slot === s.id ? 'border-[var(--ps-primary)] bg-[var(--ps-primary-light)]' : 'border-[var(--ps-border)] hover:border-slate-300'
                        }`}
                    >
                      <div className="font-medium text-slate-800 text-sm">{s.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${payment === m.id ? 'border-[var(--ps-primary)] bg-[var(--ps-primary-light)]' : 'border-[var(--ps-border)]'
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
                  disabled={placing}
                  className="flex items-center gap-2 text-white font-medium px-6 py-2.5 rounded-lg disabled:opacity-60"
                  style={{ backgroundColor: 'var(--ps-primary)' }}
                >
                  {placing ? 'Placing Order...' : <>Place Order <Check className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--ps-border)] p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-slate-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map((it) => (
                <div key={it._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--ps-primary-light)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sprout className="w-4 h-4" style={{ color: 'var(--ps-primary)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 truncate">{it.name} × {it.quantity}</div>
                  </div>
                  <div className="text-sm font-medium text-slate-800">₹{it.price * it.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-[var(--ps-border)] pt-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-slate-800">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
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