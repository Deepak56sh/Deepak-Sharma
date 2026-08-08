'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Filter, Loader2, Wheat } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80';

// Strip HTML tags for card preview text
const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Crop Farming', 'Organic Farming', 'Equipment', 'Consulting', 'Irrigation', 'Other'];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('active', 'true');
      params.append('limit', '50');

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
      const res = await fetch(`${baseUrl}/services?${params.toString()}`, {
        cache: 'no-cache',
      });

      if (!res.ok) throw new Error('Failed to fetch services');

      const data = await res.json();
      setServices(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header / Hero */}
      <section className="bg-gradient-to-br from-[#3F6B44] to-[#2C4E30] text-white pt-28 pb-16 px-4 font-body">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 tracking-tight">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto opacity-90">
            Quality farming solutions to help your land grow with modern techniques and care.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 font-body">
        {/* Search + Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E4DFC9] p-5 md:p-6 mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F7C]" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F7F4EC] border border-[#E4DFC9] rounded-xl text-[#23281D] placeholder-[#8A8F7C] focus:outline-none focus:ring-2 focus:ring-[#3F6B44]/30 focus:border-[#3F6B44] transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full lg:w-auto scrollbar-hide">
              <Filter className="w-5 h-5 text-[#8A8F7C] flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#3F6B44] text-white shadow-md'
                      : 'bg-[#F0EBD8] text-[#5B6152] hover:bg-[#E4DFC9]'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-[#3F6B44] animate-spin" />
            <span className="ml-3 text-[#5B6152]">Loading services...</span>
          </div>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service.slug || service._id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E4DFC9] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <div className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow-sm">
                    <Wheat className="w-5 h-5 text-[#3F6B44]" />
                  </div>

                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-[#3F6B44] rounded-full">
                    {service.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-semibold text-[#23281D] mb-2 group-hover:text-[#3F6B44] transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-[#5B6152] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {stripHtml(service.description)}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E4DFC9]">
                    <div>
                      {service.price && (
                        <p className="text-[#3F6B44] font-bold text-sm">{service.price}</p>
                      )}
                      {service.duration && (
                        <p className="text-xs text-[#8A8F7C]">{service.duration}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F6B44] group-hover:gap-2.5 transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-5 bg-[#F0EBD8] rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-[#8A8F7C]" />
            </div>
            <h3 className="text-xl font-semibold text-[#23281D] mb-2">No services found</h3>
            <p className="text-[#5B6152] mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No services available right now'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2.5 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Process Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#23281D] mb-3">Our Process</h2>
            <p className="text-[#5B6152] max-w-xl mx-auto">
              A simple and transparent approach to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding your land and requirements' },
              { step: '02', title: 'Planning', desc: 'Creating a clear roadmap and strategy' },
              { step: '03', title: 'Execution', desc: 'Working with modern farming practices' },
              { step: '04', title: 'Support', desc: 'Ongoing support & continuous improvement' },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-6 border border-[#E4DFC9] shadow-sm hover:shadow-md transition"
              >
                <div className="font-display text-4xl font-black text-[#3F6B44]/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-[#23281D] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5B6152]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}