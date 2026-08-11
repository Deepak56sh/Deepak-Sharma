'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, X, ShoppingCart, Sprout } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// ⚠️ ASSUMED ROUTES — badal do agar aapke backend me alag hain:
//   GET    /api/wishlist            -> { success, data: [ { _id, name, slug, price, image } ] }
//   DELETE /api/wishlist/:productId -> { success }

export default function WishlistTab() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.success ? data.data : []);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setRemovingId(productId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it._id !== productId));
      }
    } catch (err) {
      console.error('Remove wishlist item error:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const moveToCart = async (item) => {
    await addToCart(item, 1);
    removeItem(item._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8ece9] p-16 text-center">
        <Heart className="w-14 h-14 text-slate-200 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[#14261d] mb-1">Your wishlist is empty</h2>
        <p className="text-[#6b7280] text-sm mb-6">Save plants you love and find them here.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg bg-[#2f9e44] hover:bg-[#1f7a34] transition-colors"
        >
          Browse Plants
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8ece9] divide-y divide-[#e8ece9]">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-4 p-5">
          <div className="w-16 h-16 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Sprout className="w-7 h-7 text-[#2f9e44]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-[#14261d] truncate">{item.name}</div>
            <div className="font-semibold text-[#14261d] mt-0.5">₹{item.price}</div>
          </div>

          <button
            onClick={() => moveToCart(item)}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#eaf7ee] text-[#2f9e44] hover:bg-[#2f9e44] hover:text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Move to Cart
          </button>
          <button
            onClick={() => moveToCart(item)}
            className="sm:hidden p-2 rounded-lg bg-[#eaf7ee] text-[#2f9e44]"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

          <button
            onClick={() => removeItem(item._id)}
            disabled={removingId === item._id}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}