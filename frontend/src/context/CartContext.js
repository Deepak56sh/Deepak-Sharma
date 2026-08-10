'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart([]);
        setCartTotal(0);
        return;
      }

      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
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

  // ✅ Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Guest cart - store in localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const existing = guestCart.find(item => item._id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          guestCart.push({ _id: productId, quantity });
        }
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        await fetchCart();
        return;
      }

      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const updated = guestCart.map(item => {
          if (item._id === productId) {
            return { ...item, quantity };
          }
          return item;
        }).filter(item => item.quantity > 0);
        localStorage.setItem('guestCart', JSON.stringify(updated));
        await fetchCart();
        return;
      }

      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  // ✅ Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const updated = guestCart.filter(item => item._id !== productId);
        localStorage.setItem('guestCart', JSON.stringify(updated));
        await fetchCart();
        return;
      }

      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('guestCart');
        setCart([]);
        setCartTotal(0);
        return;
      }

      const res = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
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

  useEffect(() => {
    // Load guest cart from localStorage on mount
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length > 0) {
      fetchCart();
    }
  }, []);

  const value = {
    cart,
    cartTotal,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}