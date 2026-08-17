'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Leaf, ShieldCheck, Truck, Heart,
  Star, ShoppingBag, ChevronLeft, ChevronRight, CheckCircle,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import InstagramReels from '@/components/Instagram/InstagramReels';
import Testimonials from '@/components/Testimonial/Testimonials';
import CategoriesSlider from '@/components/CategoriesSlider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Rich HTML content ko plain text me convert karta hai, home page preview ke liye
function stripHtml(html = '') {
  if (!html) return '';
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '').trim();
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}

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

const defaultAboutData = {
  title: 'About Us',
  subtitle: 'Our Story',
  description1: '<p>Plantora was born out of a passion for plants and a mission to bring nature closer to every home.</p>',
  points: ['Handpicked Healthy Plants', 'Expert Plant Care Guidance', 'Sustainable & Eco-Friendly', 'Happy Customer Support'],
  stats: [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Plants Delivered' },
    { number: '150+', label: 'Plant Varieties' },
    { number: '99%', label: 'Customer Satisfaction' }
  ],
  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
};

export default function HomePage() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [badge, setBadge] = useState('Free Shipping on orders above ₹999');
  const [current, setCurrent] = useState(0);
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [categories, setCategories] = useState([]);
  const videoRefs = useRef([]);
  const [bestSellerPlants, setBestSellerPlants] = useState(bestSellers);

  // Fetch Hero
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_URL}/hero`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.slides?.length) {
          setSlides(data.data.slides);
          if (data.data.badge) setBadge(data.data.badge);
        }
      } catch {}
    };
    fetchHero();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          setCategories(data.data);
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  // Fetch About
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed');
        const result = await res.json();
        if (result.success && result.data) setAboutData(result.data);
      } catch {
        setAboutData(defaultAboutData);
      }
    };
    fetchAbout();
  }, []);

  // Fetch Best Sellers
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=50&active=true`, {
          cache: 'no-cache',
        });
        const data = await res.json();
        const allProducts = data.data || [];
        const filtered = allProducts.filter((p) => p.isBestSeller === true);
        if (filtered.length > 0) {
          setBestSellerPlants(filtered);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
      }
    };
    fetchBestSellers();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!slides.length || slides[current]?.mediaType === 'video') return;
    const timer = setTimeout(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearTimeout(timer);
  }, [current, slides]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const slide = slides[current] || fallbackSlides[0];

  return (
    <div className="plant-store bg-white w-full overflow-x-hidden">

      {/* ===================== HERO ===================== */}
      <section className="relative w-full h-[460px] xs:h-[500px] sm:h-[560px] md:h-[620px] lg:h-[680px] overflow-hidden bg-[#14261d]">
        <div className="absolute inset-0">
          {slide.mediaType === 'video' ? (
            <video
              key={slide.media}
              ref={(el) => (videoRefs.current[current] = el)}
              src={slide.media}
              poster={slide.poster}
              autoPlay muted playsInline
              onEnded={next}
              className="w-full h-full object-cover"
            />
          ) : (
            <img key={slide.media} src={slide.media} alt={slide.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14261d]/85 via-[#14261d]/50 to-[#14261d]/10" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl w-full space-y-4 sm:space-y-5 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm text-white font-medium max-w-full break-words">
              <Leaf className="w-4 h-4 text-[#7ee2a8] flex-shrink-0" />
              <span className="break-words">{badge}</span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] sm:leading-[1.1] break-words">
              {slide.title}<br />
              <span className="text-[#7ee2a8]">{slide.subtitle}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-md leading-relaxed break-words">{slide.description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={slide.primaryBtnLink || '/shop'} className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md">
                {slide.primaryBtn || 'Shop Plants'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={slide.secondaryBtnLink || '/shop'} className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 font-semibold text-sm sm:text-base rounded-xl transition-all">
                {slide.secondaryBtn || 'Explore'}
              </Link>
            </div>
          </div>
        </div>

        <button onClick={prev} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        <button onClick={next} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#2f9e44]' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="border-y border-[#e8ece9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 py-6 sm:py-7">
            {[
              { icon: Leaf, title: 'Indoor Plants', desc: 'Fresh & Healthy' },
              { icon: ShieldCheck, title: 'Air Purifying', desc: 'Better Air' },
              { icon: Heart, title: 'Low Maintenance', desc: 'Easy to Care' },
              { icon: Star, title: 'Pet Friendly', desc: 'Safe for Pets' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Pan India' },
              { icon: ShoppingBag, title: 'Secure Packaging', desc: 'Plant Safety' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#2f9e44]" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#14261d] break-words">{item.title}</p>
                <p className="text-[11px] sm:text-xs text-[#6b7280] break-words">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES SLIDER ===================== */}
      {categories.length > 0 && <CategoriesSlider categories={categories} />}

      {/* ===================== BEST SELLERS ===================== */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 flex-wrap">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d] break-words">Best Sellers</h2>
              <p className="text-[#6b7280] text-xs sm:text-sm mt-1 break-words">Handpicked plants loved by our customers</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm hover:underline flex-shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {bestSellerPlants.slice(0, 5).map((plant, i) => {
              const originalPrice = plant.originalPrice || plant.original;
              return (
                <Link
                  key={plant._id || i}
                  href={`/shop/${plant.slug || plant._id || ''}`}
                  className="group block min-w-0"
                >
                  <div className="bg-white border border-[#e8ece9] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#2f9e44]/25 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-[#f6f8f7]">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80';
                        }}
                      />
                    </div>
                    <div className="p-2.5 sm:p-3.5 min-w-0">
                      <h3 className="font-semibold text-[#14261d] text-xs sm:text-sm line-clamp-1 group-hover:text-[#2f9e44] transition-colors break-words">
                        {plant.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623] flex-shrink-0" />
                        <span className="text-xs font-medium text-[#14261d]">{plant.rating}</span>
                        <span className="text-xs text-[#9ca3af]">({plant.reviews})</span>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                        <span className="font-bold text-[#14261d] text-sm sm:text-base">₹{plant.price}</span>
                        {originalPrice && (
                          <span className="text-xs sm:text-sm text-[#9ca3af] line-through">₹{originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm">
              View All Plants <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section className="py-10 sm:py-14 lg:py-20 bg-[#f6f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="relative w-full">
                <div className="absolute -inset-4 bg-[#2f9e44]/10 rounded-3xl blur-2xl"></div>
                {/*
                  Auto-fit image box: chahe image chhoti ho, badi ho, portrait ho ya
                  landscape ho — object-contain se poori image container ke andar
                  hamesha completely visible rahegi, kabhi crop ya distort nahi hogi.
                */}
                <div className="relative rounded-3xl shadow-xl w-full h-[260px] xs:h-[300px] sm:h-[360px] md:h-[400px] bg-white overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={aboutData?.teamImage || aboutData?.image || defaultAboutData.image}
                    alt="About Plantora"
                    className="max-w-full w-full max-h-full w-auto h-auto object-cover rounded-2xl"
                    onError={(e) => { e.target.src = defaultAboutData.image; }}
                  />
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="space-y-4 sm:space-y-5 min-w-0">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d] break-words">{aboutData?.title || 'About Us'}</h2>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2f9e44] mt-1 break-words">{aboutData?.subtitle || 'Our Story'}</h3>
                </div>

                {/* Rich HTML se plain text preview, 4 lines tak clamp, layout kabhi nahi bigdega */}
                <p className="text-[#6b7280] text-sm sm:text-base leading-relaxed line-clamp-4 break-words">
                  {stripHtml(aboutData?.description1 || defaultAboutData.description1)}
                </p>
                <Link href="/about" className="inline-flex items-center gap-1.5 text-[#2f9e44] font-semibold text-sm hover:underline">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>

                <ul className="space-y-3">
                  {(aboutData?.points || defaultAboutData.points).map((item, i) => (
                    <li key={i} className="flex items-start sm:items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#2f9e44] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[#14261d] font-medium text-sm sm:text-base break-words min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  {(aboutData?.stats || defaultAboutData.stats).map((stat, i) => (
                    <div key={i} className="text-center p-2.5 sm:p-3 bg-white rounded-xl border border-[#e8ece9] min-w-0">
                      <div className="text-lg sm:text-xl font-bold text-[#2f9e44] break-words">{stat.number}</div>
                      <div className="text-[10px] sm:text-[11px] text-[#6b7280] mt-0.5 leading-tight break-words">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <Testimonials />

      {/* ===================== CTA ===================== */}
      <section className="py-12 sm:py-14 lg:py-16" style={{ backgroundColor: '#14261d' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">Ready to bring nature home?</h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto break-words">Explore our collection of premium indoor plants and transform your space today.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold text-sm sm:text-base rounded-xl transition-all">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================== INSTAGRAM REELS ===================== */}
      <InstagramReels />
    </div>
  );
}