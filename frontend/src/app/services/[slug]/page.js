'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, Clock, Tag, Wheat, Sprout } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';

export default function ServiceDetailPage() {
  const { slug } = useParams();

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

      const relatedRes = await fetch(
        `${baseUrl}/services?category=${data.data.category}&active=true&limit=4`,
        { cache: 'no-cache' }
      );
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        setRelated(
          (relatedData.data || [])
            .filter(s => s._id !== data.data._id && s.slug !== data.data.slug)
            .slice(0, 3)
        );
      }
    } catch (err) {
      setError('Service not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
        <Loader2 className="w-9 h-9 text-[#3F6B44] animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EC] px-4">
        <Sprout className="w-10 h-10 text-[#3F6B44]/40 mb-4" />
        <h2 className="text-2xl font-bold text-[#23281D] mb-2">Service Not Found</h2>
        <p className="text-[#5B6152] mb-6">{error}</p>
        <Link href="/services" className="px-6 py-3 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium transition">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 lg:pt-32 lg:pb-20 font-body">

        {/* GRID LAYOUT — fixed-width image column, content flows independently */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">

          {/* LEFT - CONTENT (flows freely, never affected by content length) */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#C68B2E] mb-4">
              <Wheat className="w-3.5 h-3.5" />
              {service.category}
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#23281D] mb-6 leading-[1.1] break-words">
              {service.title}
            </h1>

            {/* Harvest tags: price & duration */}
            <div className="flex flex-wrap gap-3 mb-8">
              {service.price && (
                <div className="inline-flex items-center gap-2 bg-[#3F6B44]/10 text-[#2C4E30] px-4 py-2 rounded-full text-sm font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  {service.price}
                </div>
              )}
              {service.duration && (
                <div className="inline-flex items-center gap-2 bg-[#C68B2E]/10 text-[#8A611E] px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {service.duration}
                </div>
              )}
            </div>

            {/* Dashed divider with leaf mark */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 border-t border-dashed border-[#D8D2B8]" />
              <Sprout className="w-4 h-4 text-[#3F6B44]/50 flex-shrink-0" />
              <div className="flex-1 border-t border-dashed border-[#D8D2B8]" />
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#23281D] prose-p:text-[#3E4436] prose-strong:text-[#23281D] prose-a:text-[#3F6B44] mb-10 break-words"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#3F6B44] hover:bg-[#2C4E30] text-white font-semibold rounded-xl transition shadow-sm"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* RIGHT - IMAGE (fixed column width, sticky, never moves) */}
          <div className="relative lg:sticky lg:top-28">
            <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-[#E4DFC9]">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-auto object-cover aspect-[4/5]"
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
              />
            </div>

            {/* Seed packet tag */}
            <div className="absolute -top-4 -left-4 -rotate-6 bg-[#FCFAF3] border border-dashed border-[#C68B2E] rounded-lg px-3.5 py-2.5 shadow-md">
              <div className="flex items-center gap-1.5 text-[#8A611E]">
                <Wheat className="w-3.5 h-3.5" />
                <span className="font-display text-xs font-semibold tracking-wide uppercase">
                  {service.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {related.length > 0 && (
          <section className="mt-24 pt-12 border-t border-[#E4DFC9]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#23281D]">More Services</h2>
              <Link href="/services" className="text-sm font-medium text-[#3F6B44] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  href={`/services/${item.slug || item._id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E4DFC9] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-[#23281D] group-hover:text-[#3F6B44] transition line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5B6152] line-clamp-2">
                      {item.description.replace(/<[^>]*>/g, '').trim()}
                    </p>
                    {item.price && (
                      <p className="text-sm font-semibold text-[#3F6B44] mt-3">{item.price}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}