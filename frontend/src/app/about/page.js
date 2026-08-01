'use client';
import { useState, useEffect } from 'react';
import { Leaf, CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const defaultAboutData = {
  title: 'About Us',
  subtitle: 'Our Story',
  description: 'Plantora was born out of a passion for plants and a mission to bring nature closer to every home. We believe plants make people happier, healthier and the better.',
  points: [
    'Handpicked Healthy Plants',
    'Expert Plant Care Guidance',
    'Sustainable & Eco-Friendly',
    'Happy Customer Support'
  ],
  stats: [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Plants Delivered' },
    { number: '150+', label: 'Plant Varieties' },
    { number: '99%', label: 'Customer Satisfaction' }
  ],
  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache'
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.success && result.data) {
          setAboutData(result.data);
        } else {
          setAboutData(defaultAboutData);
        }
      } catch (err) {
        console.error(err);
        setAboutData(defaultAboutData);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  const data = aboutData || defaultAboutData;

  return (
    <div className="plant-store bg-white">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <AnimatedSection>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#14261d] mb-2">
                    {data.title || 'About Us'}
                  </h1>
                  <h2 className="text-xl font-semibold text-[#2f9e44]">
                    {data.subtitle || 'Our Story'}
                  </h2>
                </div>

                <p className="text-[#6b7280] leading-relaxed text-base sm:text-lg">
                  {data.description || defaultAboutData.description}
                </p>

                <ul className="space-y-3 pt-2">
                  {(data.points || defaultAboutData.points).map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-[#2f9e44]" />
                      </div>
                      <span className="text-[#14261d] font-medium">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {(data.stats || defaultAboutData.stats).map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-4 bg-[#f6f8f7] rounded-2xl border border-[#e8ece9]"
                    >
                      <div className="text-2xl font-bold text-[#2f9e44]">{stat.number}</div>
                      <div className="text-xs text-[#6b7280] mt-1 leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Right Image */}
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-[#2f9e44]/10 rounded-3xl blur-2xl"></div>
                <img
                  src={data.image || defaultAboutData.image}
                  alt="About Plantora"
                  className="relative rounded-3xl shadow-xl w-full h-[400px] sm:h-[480px] object-cover"
                  onError={(e) => {
                    e.target.src = defaultAboutData.image;
                  }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}