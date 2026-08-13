'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Leaf } from 'lucide-react';

export default function CategoriesSlider({ categories = [] }) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  // ✅ FIX: canScrollRight ko sahi se calculate karo jab component mount ho
  // (pehle ye hamesha `true` hardcoded tha, chahe items screen me fit ho jaate the)
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  const showSlider = categories.length > 5;

  if (!categories.length) return null;

  return (
    <section className="py-12 lg:py-16 bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d]">Shop by Category</h2>
            <p className="text-[#6b7280] text-sm mt-1">Browse our plant collections</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Slider arrows — sirf 5 se zyada items ho toh dikhega */}
            {showSlider && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full border border-[#e8ece9] bg-white flex items-center justify-center text-[#6b7280] hover:border-[#2f9e44] hover:text-[#2f9e44] disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full border border-[#e8ece9] bg-white flex items-center justify-center text-[#6b7280] hover:border-[#2f9e44] hover:text-[#2f9e44] disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Categories — 5 ya kam hain toh grid, zyada hain toh slider */}
        {showSlider ? (
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <CategoryCard key={cat._id} cat={cat} fixedWidth />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} cat={cat} />
            ))}
          </div>
        )}

        {/* View All — mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, fixedWidth = false }) {
  return (
    <Link
      href={`/shop?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
      className={`group block ${fixedWidth ? 'flex-shrink-0 w-[160px]' : 'w-full'}`}
    >
      <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden hover:shadow-lg hover:border-[#2f9e44]/30 transition-all duration-300">
        {/* Image — ✅ FIX: inline aspect-ratio use kiya hai (Tailwind ke
            `aspect-square` par depend nahi karna, kyunki build me kabhi kabhi
            apply nahi hota aur image apni original tall size me full-width
            stretch ho jaati hai — yahi bug screenshot me dikh raha tha) */}
        <div
          className="relative w-full overflow-hidden bg-[#f6f8f7]"
          style={{ aspectRatio: '1 / 1' }}
        >
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="absolute inset-0 items-center justify-center bg-[#eaf7ee]"
            style={{ display: cat.image ? 'none' : 'flex' }}
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
            <p className="text-xs text-[#9ca3af] mt-0.5 line-clamp-1">{cat.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}