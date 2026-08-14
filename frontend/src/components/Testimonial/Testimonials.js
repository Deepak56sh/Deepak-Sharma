'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://my-site-backend-0661.onrender.com/api';

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

export default function Testimonials({
  title = 'What Customers Say',
  subtitle = 'Real love from plant parents across India',
}) {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  const sliderRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/testimonials`, {
          cache: 'no-store',
        });

        const data = await res.json();

        if (data.success && data.data?.length) {
          setTestimonials(data.data);
        }
      } catch {
        // Keep fallback testimonials
      }
    };

    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  // Slider sirf tab enable hoga jab 4 se zyada items hon
  const isSlider = testimonials.length > 4;

  const scrollByPage = (direction) => {
    const el = sliderRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth : el.clientWidth,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 5);

    // Figure out which card is closest to the left edge, for the active dot
    let closest = 0;
    let minDiff = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const diff = Math.abs(card.offsetLeft - el.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d]">
              {title}
            </h2>

            <p className="text-[#6b7280] text-sm mt-1">
              {subtitle}
            </p>
          </div>

          {/* Slider Buttons */}
          {isSlider && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByPage('left')}
                disabled={!canScrollLeft}
                aria-label="Previous testimonials"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#e8ece9] flex items-center justify-center text-[#14261d] hover:bg-[#2f9e44] hover:text-white hover:border-[#2f9e44] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#14261d] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollByPage('right')}
                disabled={!canScrollRight}
                aria-label="Next testimonials"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#e8ece9] flex items-center justify-center text-[#14261d] hover:bg-[#2f9e44] hover:text-white hover:border-[#2f9e44] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#14261d] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ========================= */}
        {/* 4 OR LESS = NORMAL GRID */}
        {/* ========================= */}
        {!isSlider ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <AnimatedSection key={t._id}>
                <TestimonialCard testimonial={t} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          /* ========================= */
          /* MORE THAN 4 = SCROLL-SNAP SLIDER (works correctly at every screen size) */
          /* ========================= */
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="scrollbar-hide flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t._id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="flex-shrink-0 snap-start w-[85%] xs:w-[75%] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <AnimatedSection>
                  <TestimonialCard testimonial={t} />
                </AnimatedSection>
              </div>
            ))}
          </div>
        )}

        {/* Dots */}
        {isSlider && (
          <div className="flex justify-center items-center gap-1.5 mt-6 sm:mt-7">
            {testimonials.map((t, index) => (
              <button
                key={t._id}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? 'w-6 bg-[#2f9e44]'
                    : 'w-2 bg-[#cbd5d0]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}


/* ================================= */
/* TESTIMONIAL CARD */
/* ================================= */

function TestimonialCard({ testimonial: t }) {
  return (
    <div className="h-full min-h-[240px] sm:min-h-[260px] bg-white rounded-2xl border border-[#e8ece9] p-4 sm:p-5 flex flex-col hover:shadow-md transition-shadow">

      {/* Quote */}
      <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-[#2f9e44]/30 mb-3" />

      {/* Text */}
      <p className="text-sm text-[#4b5563] leading-relaxed flex-1 break-words">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-4 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < (t.rating || 5)
                ? 'fill-[#f5a623] text-[#f5a623]'
                : 'text-slate-200'
            }`}
          />
        ))}
      </div>

      {/* User */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#e8ece9]">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#14261d] truncate">
            {t.name}
          </p>

          <p className="text-xs text-[#9ca3af] truncate">
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}