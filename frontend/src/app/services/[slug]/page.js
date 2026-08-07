'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, Check, Loader2,
  Code, Smartphone, Palette, Cloud, Brain, 
  TrendingUp, Database, Lock, Globe, Zap,
  Clock, Tag
} from 'lucide-react';

const iconMap = {
  Code, Smartphone, Palette, Cloud, Brain, 
  TrendingUp, Database, Lock, Globe, Zap
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) fetchService();
  }, [slug]);

  const fetchService = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
      
      const res = await fetch(`${baseUrl}/services/${slug}`, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Service not found');

      const data = await res.json();
      setService(data.data);

      // Fetch related services (same category)
      const relatedRes = await fetch(
        `${baseUrl}/services?category=${data.data.category}&active=true&limit=4`,
        { cache: 'no-cache' }
      );
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        setRelated(
          (relatedData.data || []).filter(
            (s) => s._id !== data.data._id && s.slug !== data.data.slug
          ).slice(0, 3)
        );
      }
    } catch (err) {
      console.error(err);
      setError('Service not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <Loader2 className="w-10 h-10 text-[#0f5132] animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf8] px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Service Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href="/services"
          className="px-6 py-3 bg-[#0f5132] text-white rounded-xl font-medium hover:bg-[#0d4529] transition"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Code;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f5132] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Image */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[380px] md:h-[460px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80';
                }}
              />
              <div className="absolute top-5 left-5">
                <span className="px-4 py-1.5 bg-white/95 backdrop-blur text-sm font-semibold text-[#0f5132] rounded-full shadow-sm">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {service.price && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs font-medium">Price</span>
                  </div>
                  <p className="text-lg font-bold text-[#0f5132]">{service.price}</p>
                </div>
              )}
              {service.duration && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Duration</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{service.duration}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#0f5132]" />
              </div>
              <span className="text-sm font-medium text-[#0f5132] bg-green-50 px-3 py-1 rounded-full">
                {service.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {service.title}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {service.description}
            </p>

            {/* Features */}
            {service.features?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#0f5132]" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {service.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#0f5132] hover:bg-[#0d4529] text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-3">
                Have questions? Reach out and we'll get back to you quickly.
              </p>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Services</h2>
              <Link
                href="/services"
                className="text-sm font-medium text-[#0f5132] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => {
                const RelIcon = iconMap[item.icon] || Code;
                return (
                  <Link
                    key={item._id}
                    href={`/services/${item.slug || item._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-lg flex items-center justify-center">
                        <RelIcon className="w-4 h-4 text-[#0f5132]" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#0f5132] transition line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      {item.price && (
                        <p className="text-sm font-semibold text-[#0f5132] mt-3">{item.price}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}