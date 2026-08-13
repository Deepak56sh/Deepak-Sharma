'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Leaf,
} from 'lucide-react';

export default function CategoriesSlider({ categories = [] }) {
  const sliderRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(
    categories.length > 5
  );

  // 5 se zyada items hain toh slider
  const showSlider = categories.length > 5;

  const scroll = (direction) => {
    const el = sliderRef.current;

    if (!el) return;

    const scrollAmount = 300;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const el = sliderRef.current;

    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 5);
  };

  return (
    <section className="py-12 lg:py-16 bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d]">
              Shop by Category
            </h2>

            <p className="text-[#6b7280] text-sm mt-1">
              Browse our plant collections
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Slider Arrows */}
            {showSlider && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous categories"
                  className="w-9 h-9 rounded-full border border-[#e8ece9] bg-white flex items-center justify-center text-[#6b7280] hover:border-[#2f9e44] hover:text-[#2f9e44] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next categories"
                  className="w-9 h-9 rounded-full border border-[#e8ece9] bg-white flex items-center justify-center text-[#6b7280] hover:border-[#2f9e44] hover:text-[#2f9e44] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* View All */}
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ============================ */}
        {/* 5 OR LESS = NORMAL GRID */}
        {/* ============================ */}

        {!showSlider && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                cat={cat}
                isSlider={false}
              />
            ))}
          </div>
        )}

        {/* ============================ */}
        {/* MORE THAN 5 = SLIDER */}
        {/* ============================ */}

        {showSlider && (
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                cat={cat}
                isSlider={true}
              />
            ))}
          </div>
        )}

        {/* View All — Mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================= */
/* CATEGORY CARD */
/* ================================= */

function CategoryCard({ cat, isSlider }) {
  const slug =
    cat.slug ||
    cat.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`/shop?category=${slug}`}
      className={`
        group
        ${isSlider
          ? 'flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[calc((100%-64px)/5)] snap-start'
          : 'w-full'
        }
      `}
    >
      <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden hover:shadow-lg hover:border-[#2f9e44]/30 transition-all duration-300 h-full">

        {/* Image */}
        <div className="aspect-square overflow-hidden bg-[#f6f8f7]">
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';

                const fallback = e.currentTarget.nextElementSibling;

                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}

          {/* Fallback */}
          <div
            className="w-full h-full items-center justify-center bg-[#eaf7ee]"
            style={{
              display: cat.image ? 'none' : 'flex',
            }}
          >
            <Leaf className="w-8 h-8 text-[#2f9e44]" />
          </div>
        </div>

        {/* Name */}
        <div className="p-3 text-center">
          <p className="font-semibold text-[#14261d] text-sm group-hover:text-[#2f9e44] transition-colors truncate">
            {cat.name}
          </p>

          {cat.description && (
            <p className="text-xs text-[#9ca3af] mt-0.5 line-clamp-1">
              {cat.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}