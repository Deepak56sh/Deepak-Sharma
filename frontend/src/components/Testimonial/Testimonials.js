'use client';
import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const fallbackTestimonials = [
  {
    _id: '1',
    name: 'Priya Sharma',
    role: 'Mumbai',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    text: 'My Monstera arrived healthy and beautifully packed. Plantora is now my go-to for every plant!',
  },
  {
    _id: '2',
    name: 'Rahul Verma',
    role: 'Delhi',
    avatar: 'https://i.pravatar.cc/100?img=12',
    rating: 5,
    text: 'Snake plant is thriving. Delivery was fast and the care guide helped a lot.',
  },
  {
    _id: '3',
    name: 'Ananya Patel',
    role: 'Bangalore',
    avatar: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    text: 'Love the quality. Ordered thrice already — every plant looks exactly like the photos.',
  },
  {
    _id: '4',
    name: 'Vikram Singh',
    role: 'Jaipur',
    avatar: 'https://i.pravatar.cc/100?img=8',
    rating: 4,
    text: 'Great packaging and healthy plants. Customer support answered all my care questions.',
  },
];

export default function Testimonials({ title = 'What Customers Say', subtitle = 'Real love from plant parents across India' }) {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/testimonials`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.length) {
          setTestimonials(data.data);
        }
      } catch {
        // keep fallback
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="py-14 lg:py-16 bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d]">{title}</h2>
          <p className="text-[#6b7280] text-sm mt-1">{subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <AnimatedSection key={t._id}>
              <div className="h-full bg-white rounded-2xl border border-[#e8ece9] p-5 flex flex-col hover:shadow-md transition-shadow">
                <Quote className="w-8 h-8 text-[#2f9e44]/30 mb-3" />
                <p className="text-sm text-[#4b5563] leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-1 mt-4 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (t.rating || 5) ? 'fill-[#f5a623] text-[#f5a623]' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#e8ece9]">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#14261d]">{t.name}</p>
                    <p className="text-xs text-[#9ca3af]">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}