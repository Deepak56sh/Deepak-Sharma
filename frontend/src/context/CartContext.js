'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const calcTotal = (items) => items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // ✅ FIXED — guest cart ab localStorage se seedha load hota hai, backend call nahi lagti
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCart(guestCart);
      setCartTotal(calcTotal(guestCart));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data.items || []);
        setCartTotal(data.data.total || 0);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  // ✅ FIXED — ab poora product object accept karta hai (product detail page jaisa hi call karta hai)
  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existing = guestCart.find((item) => item._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image || product.images?.[0],
          quantity,
        });
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCart(guestCart);
      setCartTotal(calcTotal(guestCart));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const data = await res.json();
      if (data.success) await fetchCart();
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updated = guestCart
        .map((item) => (item._id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
      localStorage.setItem('guestCart', JSON.stringify(updated));
      setCart(updated);
      setCartTotal(calcTotal(updated));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) await fetchCart();
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updated = guestCart.filter((item) => item._id !== productId);
      localStorage.setItem('guestCart', JSON.stringify(updated));
      setCart(updated);
      setCartTotal(calcTotal(updated));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await fetchCart();
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('guestCart');
      setCart([]);
      setCartTotal(0);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCart([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  // ✅ FIXED — mount pe hamesha fetchCart() chalega (login ho ya na ho)
  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart, cartTotal, cartCount, loading,
    fetchCart, addToCart, updateQuantity, removeFromCart, clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}