'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function ReviewForm({ productId }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: 5,
    text: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/testimonials/customer-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productId: productId
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', rating: 5, text: '' });
      }
    } catch (error) {
      console.error('Review submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-6 p-6 bg-green-50 rounded-2xl text-center">
        <p className="text-green-700 font-medium">
          ✅ Thank you! Your review is pending approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 bg-[#f6f8f7] rounded-2xl">
      <h3 className="font-semibold text-[#14261d] mb-4">Write a Review</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name *"
          required
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          className="px-4 py-2 rounded-xl border border-[#e8ece9] bg-white focus:outline-none focus:ring-2 focus:ring-[#2f9e44]"
        />
        <input
          type="email"
          placeholder="Your Email *"
          required
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="px-4 py-2 rounded-xl border border-[#e8ece9] bg-white focus:outline-none focus:ring-2 focus:ring-[#2f9e44]"
        />
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-medium text-[#14261d]">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setForm({...form, rating: star})}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {star <= form.rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      
      <textarea
        placeholder="Your Review *"
        required
        rows={3}
        value={form.text}
        onChange={(e) => setForm({...form, text: e.target.value})}
        className="w-full mt-3 px-4 py-2 rounded-xl border border-[#e8ece9] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2f9e44]"
      />
      
      <button
        type="submit"
        disabled={loading}
        className="mt-3 px-6 py-2 bg-[#2f9e44] text-white rounded-xl font-medium hover:bg-[#1f7a34] transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}