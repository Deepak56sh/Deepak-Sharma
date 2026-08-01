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
  ShoppingBag
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function HomePage() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${API_URL}/hero`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch hero data');

        const result = await res.json();
        setHeroData(result.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setHeroData({
          badge: 'Free Shipping on orders above ₹999',
          mainTitle: 'Bring Nature',
          subTitle: 'Into Your Home',
          description: 'Premium indoor plants, stylish planters and expert care tips to create a greener living.',
          primaryButton: 'Shop Plants',
          primaryButtonType: 'page',
          primaryButtonLink: '/shop',
          secondaryButton: 'Explore Collections',
          secondaryButtonType: 'page',
          secondaryButtonLink: '/shop'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  return (
    <div className="plant-store">
      {/* Hero Section */}
      <section className="relative bg-[#f6f8f7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <AnimatedSection>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#e8ece9] rounded-full text-sm text-[#2f9e44] font-medium shadow-sm">
                  <Leaf className="w-4 h-4" />
                  {heroData?.badge || 'Free Shipping on orders above ₹999'}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#14261d] leading-tight">
                  {heroData?.mainTitle || 'Bring Nature'}
                  <br />
                  <span className="text-[#2f9e44]">
                    {heroData?.subTitle || 'Into Your Home'}
                  </span>
                </h1>

                <p className="text-lg text-[#6b7280] max-w-lg leading-relaxed">
                  {heroData?.description || 'Premium indoor plants, stylish planters and expert care tips to create a greener living.'}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={heroData?.primaryButtonLink || '/shop'}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {heroData?.primaryButton || 'Shop Plants'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href={heroData?.secondaryButtonLink || '/shop'}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-[#2f9e44] text-[#2f9e44] hover:bg-[#eaf7ee] font-semibold rounded-xl transition-all duration-300"
                  >
                    {heroData?.secondaryButton || 'Explore Collections'}
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Image */}
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-[#2f9e44]/10 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=900&q=80"
                  alt="Beautiful indoor plants"
                  className="relative rounded-3xl shadow-2xl w-full h-[380px] sm:h-[440px] object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-[#e8ece9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-8">
            {[
              { icon: Leaf, title: 'Indoor Plants', desc: 'Fresh & Healthy' },
              { icon: ShieldCheck, title: 'Air Purifying', desc: 'Better Air' },
              { icon: Heart, title: 'Low Maintenance', desc: 'Easy to Care' },
              { icon: Star, title: 'Pet Friendly', desc: 'Safe for Pets' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Pan India' },
              { icon: ShoppingBag, title: 'Secure Packaging', desc: 'Plant Safety' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#eaf7ee] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#2f9e44]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#14261d]">{item.title}</p>
                  <p className="text-xs text-[#6b7280]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#14261d]">Best Sellers</h2>
                <p className="text-[#6b7280] mt-1">Handpicked plants loved by our customers</p>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 text-[#2f9e44] font-semibold hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
            {[
              {
                name: 'Snake Plant',
                price: 449,
                original: 599,
                rating: 4.7,
                reviews: 128,
                image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&q=80'
              },
              {
                name: 'Peace Lily',
                price: 599,
                original: 799,
                rating: 4.8,
                reviews: 96,
                image: 'https://images.unsplash.com/photo-1592150621744-b18d0c0f0b0b?w=400&q=80'
              },
              {
                name: 'ZZ Plant',
                price: 649,
                original: 849,
                rating: 4.9,
                reviews: 84,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80'
              },
              {
                name: 'Fiddle Leaf Fig',
                price: 1299,
                original: 1599,
                rating: 4.6,
                reviews: 67,
                image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=400&q=80'
              },
              {
                name: 'Monstera Deliciosa',
                price: 899,
                original: 1199,
                rating: 4.9,
                reviews: 152,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80'
              },
            ].map((plant, i) => (
              <AnimatedSection key={i}>
                <Link href="/shop" className="group block">
                  <div className="bg-white border border-[#e8ece9] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2f9e44]/30 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-[#f6f8f7]">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#14261d] text-sm sm:text-base line-clamp-1 group-hover:text-[#2f9e44] transition-colors">
                        {plant.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                        <span className="text-xs font-medium text-[#14261d]">{plant.rating}</span>
                        <span className="text-xs text-[#6b7280]">({plant.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-[#14261d]">₹{plant.price}</span>
                        <span className="text-sm text-[#6b7280] line-through">₹{plant.original}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#2f9e44] font-semibold"
            >
              View All Plants <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-16 lg:py-20 bg-[#f6f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
                  alt="About Plantora"
                  className="rounded-3xl shadow-xl w-full h-[360px] object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#14261d]">About Us</h2>
                <h3 className="text-xl font-semibold text-[#2f9e44]">Our Story</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Plantora was born out of a passion for plants and a mission to bring nature closer to every home. We believe plants make people happier, healthier and the better.
                </p>

                <ul className="space-y-3">
                  {[
                    'Handpicked Healthy Plants',
                    'Expert Plant Care Guidance',
                    'Sustainable & Eco-Friendly',
                    'Happy Customer Support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#14261d]">
                      <div className="w-5 h-5 rounded-full bg-[#2f9e44] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {[
                    { number: '10K+', label: 'Happy Customers' },
                    { number: '50K+', label: 'Plants Delivered' },
                    { number: '150+', label: 'Plant Varieties' },
                    { number: '99%', label: 'Customer Satisfaction' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-white rounded-xl border border-[#e8ece9]">
                      <div className="text-xl font-bold text-[#2f9e44]">{stat.number}</div>
                      <div className="text-xs text-[#6b7280] mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#14261d]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to bring nature home?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Explore our collection of premium indoor plants and transform your space today.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}