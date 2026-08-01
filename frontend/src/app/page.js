'use client';
import { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const slides = [
  {
    title: 'Bring Nature',
    subtitle: 'Into Your Home',
    description: 'Premium indoor plants, stylish planters and expert care tips to create a greener living.',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=900&q=80',
    primaryBtn: 'Shop Plants',
    secondaryBtn: 'Explore Collections',
  },
  {
    title: 'Fresh Plants',
    subtitle: 'Delivered Free',
    description: 'Handpicked healthy plants with free shipping on orders above ₹999 across India.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80',
    primaryBtn: 'Shop Now',
    secondaryBtn: 'View Best Sellers',
  },
  {
    title: 'Air Purifying',
    subtitle: 'Plants Collection',
    description: 'Breathe cleaner air with our carefully selected air-purifying indoor plants.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=900&q=80',
    primaryBtn: 'Explore Plants',
    secondaryBtn: 'Care Guide',
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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="plant-store bg-white">
      {/* ========== HERO SLIDER ========== */}
      <section className="relative bg-[#f6f8f7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#e8ece9] rounded-full text-sm text-[#2f9e44] font-medium shadow-sm">
                <Leaf className="w-4 h-4" />
                Free Shipping on orders above ₹999
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#14261d] leading-[1.15]">
                {slides[current].title}
                <br />
                <span className="text-[#2f9e44]">{slides[current].subtitle}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6b7280] max-w-md leading-relaxed">
                {slides[current].description}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  {slides[current].primaryBtn}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#2f9e44] text-[#2f9e44] hover:bg-[#eaf7ee] font-semibold rounded-xl transition-all"
                >
                  {slides[current].secondaryBtn}
                </Link>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2 pt-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 bg-[#2f9e44]' : 'w-2 bg-[#d1d5db]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Image + Arrows */}
            <div className="relative">
              <div className="absolute -inset-3 bg-[#2f9e44]/10 rounded-3xl blur-2xl" />
              <img
                src={slides[current].image}
                alt="Hero plant"
                className="relative rounded-3xl shadow-xl w-full h-[300px] sm:h-[380px] lg:h-[400px] object-cover"
              />
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#14261d]" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#14261d]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES BAR ========== */}
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

      {/* ========== BEST SELLERS ========== */}
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
    </div>
  );
}