'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Minus, Plus, X, Tag, ArrowRight, ShoppingBag, Sprout, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, fetchCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsLoading(false);
    };
    loadCart();
  }, []);

  const updateQty = (id, delta) => {
    const item = cart.find((it) => it._id === id);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty < 1) return;
      updateQuantity(id, newQty);
    }
  };

  const removeItem = (id) => removeFromCart(id);

  const subtotal = cartTotal || 0;

  // ✅ FIXED — ab real backend se coupon validate hota hai (PLANT10 hardcoded nahi hai)
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: data.data.code, discount: data.data.discount });
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('Apply coupon error:', err);
      setCouponError('Something went wrong. Please try again.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // ✅ NEW — cart badalne pe (qty change / item remove) applied coupon ka discount
  // dobara backend se validate hota hai, taaki min-order fail hone pe ya percentage
  // discount ka amount badalne pe total sahi rahe
  useEffect(() => {
    if (!appliedCoupon) return;
    const revalidate = async () => {
      try {
        const res = await fetch(`${API_URL}/coupons/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedCoupon.code, cartTotal: subtotal }),
        });
        const data = await res.json();
        if (data.success) {
          setAppliedCoupon({ code: data.data.code, discount: data.data.discount });
        } else {
          setAppliedCoupon(null);
          setCouponError(data.message || 'Coupon is no longer valid for this cart');
        }
      } catch (err) {
        console.error('Revalidate coupon error:', err);
      }
    };
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const appliedDiscount = appliedCoupon?.discount || 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal - appliedDiscount + shipping;

  if (isLoading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  return (
    <div className="plant-store min-h-screen bg-[#f6f8f7] py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5 sm:mb-6">
          <Link href="/" className="hover:text-[#2f9e44]">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Cart</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5 sm:mb-6">
          Cart <span className="text-slate-400 font-normal">({cart.length} items)</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e8ece9] p-8 sm:p-16 text-center">
            <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 text-slate-200 mx-auto mb-4" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-6">Looks like you haven&apos;t added any plants yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg bg-[#2f9e44] hover:bg-[#1f7a34] transition-colors text-sm sm:text-base"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8ece9] divide-y divide-[#e8ece9]">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4 sm:p-5"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-[#2f9e44]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <div className="font-medium text-slate-800 text-sm sm:text-base break-words">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center border border-[#e8ece9] rounded-lg flex-shrink-0">
                    <button
                      onClick={() => updateQty(item._id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-16 sm:w-20 text-right font-semibold text-slate-800 text-sm sm:text-base flex-shrink-0 hidden sm:block">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0 ml-auto sm:ml-0"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Line total shown on its own row on mobile */}
                  <div className="w-full sm:hidden flex justify-end text-sm font-semibold text-slate-800 -mt-1">
                    Total: ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="p-4 sm:p-5">
                <Link href="/shop" className="text-sm font-medium text-[#2f9e44] hover:underline">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-[#e8ece9] p-5 sm:p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-semibold text-slate-800 mb-4">Order Summary</h2>

              <div className="mb-4">
                <label className="text-sm text-slate-500 mb-2 block">Have a coupon code?</label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#eaf7ee] border border-[#2f9e44]/30 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 text-sm text-[#2f9e44] font-medium min-w-0">
                      <Tag className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{appliedCoupon.code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col xs:flex-row gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                        placeholder="Enter code"
                        className="w-full pl-9 pr-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-[#e8ece9] text-slate-600 hover:border-[#2f9e44] hover:text-[#2f9e44] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 flex-shrink-0"
                    >
                      {applyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}

                {appliedCoupon && (
                  <p className="text-xs mt-1.5 text-[#2f9e44]">
                    Coupon applied — ₹{appliedDiscount} off!
                  </p>
                )}
                {couponError && (
                  <p className="text-xs mt-1.5 text-red-500">{couponError}</p>
                )}
              </div>

              <div className="space-y-2 text-sm border-t border-[#e8ece9] pt-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#2f9e44]">
                    <span>Discount</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-slate-800">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-slate-800 text-base border-t border-[#e8ece9] mt-4 pt-4">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-5 flex items-center justify-center gap-2 text-white font-medium py-3 rounded-lg bg-[#2f9e44] hover:bg-[#1f7a34] transition-colors text-sm sm:text-base"
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