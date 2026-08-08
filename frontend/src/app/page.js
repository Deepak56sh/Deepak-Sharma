'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import InstagramReels from '@/components/Instagram/InstagramReels'; // ✅ NEW: reusable, video-capable
import Testimonials from '@/components/Testimonial/Testimonials'; // ✅ NEW: reusable

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const fallbackSlides = [
  {
    mediaType: 'image',
    media: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1600&q=80',
    title: 'Bring Nature',
    subtitle: 'Into Your Home',
    description: 'Premium indoor plants, stylish planters and expert care tips to create a greener living.',
    primaryBtn: 'Shop Plants',
    primaryBtnLink: '/shop',
    secondaryBtn: 'Explore Collections',
    secondaryBtnLink: '/shop',
  },
  {
    mediaType: 'video',
    media: 'https://cdn.coverr.co/videos/coverr-watering-a-plant-2652/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
    title: 'Fresh Plants',
    subtitle: 'Delivered Free',
    description: 'Handpicked healthy plants with free shipping on orders above ₹999 across India.',
    primaryBtn: 'Shop Now',
    primaryBtnLink: '/shop',
    secondaryBtn: 'View Best Sellers',
    secondaryBtnLink: '/shop',
  },
  {
    mediaType: 'image',
    media: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=1600&q=80',
    title: 'Air Purifying',
    subtitle: 'Plants Collection',
    description: 'Breathe cleaner air with our carefully selected air-purifying indoor plants.',
    primaryBtn: 'Explore Plants',
    primaryBtnLink: '/shop',
    secondaryBtn: 'Care Guide',
    secondaryBtnLink: '/care-guide',
  },
];

const bestSellers = [
  { name: 'Snake Plant', price: 449, original: 599, rating: 4.7, reviews: 128, image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&q=80' },
  { name: 'Peace Lily', price: 599, original: 799, rating: 4.8, reviews: 96, image: 'https://images.unsplash.com/photo-1592150621744-b18d0c0f0b0b?w=400&q=80' },
  { name: 'ZZ Plant', price: 649, original: 849, rating: 4.9, reviews: 84, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80' },
  { name: 'Fiddle Leaf Fig', price: 1299, original: 1599, rating: 4.6, reviews: 67, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=400&q=80' },
  { name: 'Monstera Deliciosa', price: 899, original: 1199, rating: 4.9, reviews: 152, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80' },
];

export default function HomePage() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [badge, setBadge] = useState('Free Shipping on orders above ₹999');
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_URL}/hero`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.slides?.length) {
          setSlides(data.data.slides);
          if (data.data.badge) setBadge(data.data.badge);
        }
      } catch {
        // fallback
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (!slides.length || slides[current]?.mediaType === 'video') return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, slides]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const slide = slides[current] || fallbackSlides[0];

  return (
    <div className="plant-store bg-white">
      {/* ===================== HERO ===================== */}
      <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden bg-[#14261d]">
        <div className="absolute inset-0">
          {slide.mediaType === 'video' ? (
            <video
              key={slide.media}
              ref={(el) => (videoRefs.current[current] = el)}
              src={slide.media}
              poster={slide.poster}
              autoPlay
              muted
              playsInline
              onEnded={next}
              className="w-full h-full object-cover"
            />
          ) : (
            <img key={slide.media} src={slide.media} alt={slide.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14261d]/85 via-[#14261d]/50 to-[#14261d]/10" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white font-medium">
              <Leaf className="w-4 h-4 text-[#7ee2a8]" />
              {badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1]">
              {slide.title}
              <br />
              <span className="text-[#7ee2a8]">{slide.subtitle}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-md leading-relaxed">{slide.description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={slide.primaryBtnLink || '/shop'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all shadow-md"
              >
                {slide.primaryBtn || 'Shop Plants'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.secondaryBtnLink || '/shop'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 font-semibold rounded-xl transition-all"
              >
                {slide.secondaryBtn || 'Explore'}
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-[#2f9e44]' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="border-y border-[#e8ece9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 py-7">
            {[
              { icon: Leaf, title: 'Indoor Plants', desc: 'Fresh & Healthy' },
              { icon: ShieldCheck, title: 'Air Purifying', desc: 'Better Air' },
              { icon: Heart, title: 'Low Maintenance', desc: 'Easy to Care' },
              { icon: Star, title: 'Pet Friendly', desc: 'Safe for Pets' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Pan India' },
              { icon: ShoppingBag, title: 'Secure Packaging', desc: 'Plant Safety' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-11 h-11 rounded-full bg-[#eaf7ee] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#2f9e44]" />
                </div>
                <p className="text-sm font-semibold text-[#14261d]">{item.title}</p>
                <p className="text-xs text-[#6b7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BEST SELLERS ===================== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d]">Best Sellers</h2>
              <p className="text-[#6b7280] text-sm mt-1">Handpicked plants loved by our customers</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {bestSellers.map((plant, i) => (
              <Link key={i} href="/shop" className="group block">
                <div className="bg-white border border-[#e8ece9] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#2f9e44]/25 transition-all duration-300">
                  <div className="aspect-square overflow-hidden bg-[#f6f8f7]">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-semibold text-[#14261d] text-sm line-clamp-1 group-hover:text-[#2f9e44] transition-colors">
                      {plant.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                      <span className="text-xs font-medium text-[#14261d]">{plant.rating}</span>
                      <span className="text-xs text-[#9ca3af]">({plant.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-bold text-[#14261d]">₹{plant.price}</span>
                      <span className="text-sm text-[#9ca3af] line-through">₹{plant.original}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm">
              View All Plants <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      {awards.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#f6f8f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eaf7ee] mb-4">
                  <AwardIcon className="w-7 h-7 text-[#2f9e44]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d] mb-2">
                  Awards & Recognition
                </h2>
                <p className="text-[#6b7280] max-w-xl mx-auto">
                  Honored for our commitment to quality and sustainable practices
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award, i) => (
                <AnimatedSection key={award._id || i}>
                  <div className="bg-white rounded-2xl border border-[#e8ece9] p-5 flex items-center gap-4 hover:shadow-md transition-shadow flex-col text-center">
                    <img
                      src={award.image}
                      alt={award.title}
                      className="w-full h-full rounded-xl object-cover flex-shrink-0"
                    />
                    <p className="text-[#14261d] font-medium leading-snug">
                      {award.title}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ===================== TESTIMONIALS ===================== */}
      {/* ✅ NEW: now a reusable component, data managed from Admin → Testimonials */}
      <Testimonials />

      {/* ===================== CTA ===================== */}
      <section className="py-14 lg:py-16" style={{ backgroundColor: '#14261d' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to bring nature home?
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Explore our collection of premium indoor plants and transform your space today.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================== INSTAGRAM REELS ===================== */}
      {/* ✅ NEW: now a reusable component with real video upload, data managed from Admin → Instagram Reels */}
      <InstagramReels />
    </div>
  );
}