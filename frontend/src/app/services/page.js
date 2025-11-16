// ============================================
// FILE: src/app/services/page.js (UPDATED)
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Code, Smartphone, Palette, Cloud, Brain, TrendingUp, Database, Lock, Globe, Zap, Loader2, Search, Filter } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Icon mapping
const iconMap = {
  Code, Smartphone, Palette, Cloud, Brain, TrendingUp, Database, Lock, Globe, Zap
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Default services data - will show when API has no data or fails
  const defaultServices = [
    {
      _id: '1',
      title: 'Web Development',
      description: 'Build responsive, high-performance websites that engage and convert your audience with modern technologies.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      color: 'from-blue-500 to-cyan-500',
      icon: 'Code',
      category: 'Development',
      isActive: true,
      order: 1,
      price: '$500 - $5000',
      duration: '2-4 weeks',
      features: ['React & Next.js', 'Responsive Design', 'SEO Optimized', 'Fast Performance'],
      tags: ['web', 'development', 'react', 'nextjs']
    },
    {
      _id: '2',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile solutions for iOS and Android that deliver seamless experiences.',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
      color: 'from-purple-500 to-pink-500',
      icon: 'Smartphone',
      category: 'Development',
      isActive: true,
      order: 2,
      price: '$1000 - $10000',
      duration: '4-8 weeks',
      features: ['iOS & Android', 'Cross-Platform', 'Native Performance', 'App Store Ready'],
      tags: ['mobile', 'ios', 'android', 'react-native']
    },
    {
      _id: '3',
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that users love to interact with, backed by research and testing.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
      color: 'from-pink-500 to-rose-500',
      icon: 'Palette',
      category: 'Design',
      isActive: true,
      order: 3,
      price: '$300 - $3000',
      duration: '1-3 weeks',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      tags: ['design', 'ui', 'ux', 'prototype']
    },
    {
      _id: '4',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure for modern applications with AWS, Azure, and Google Cloud.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
      color: 'from-indigo-500 to-purple-500',
      icon: 'Cloud',
      category: 'Cloud',
      isActive: true,
      order: 4,
      price: '$200 - $2000/month',
      duration: 'Ongoing',
      features: ['AWS & Azure', 'Auto Scaling', 'Load Balancing', '99.9% Uptime'],
      tags: ['cloud', 'aws', 'azure', 'infrastructure']
    },
    {
      _id: '5',
      title: 'AI Integration',
      description: 'Harness the power of artificial intelligence and machine learning in your products.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      color: 'from-emerald-500 to-teal-500',
      icon: 'Brain',
      category: 'AI',
      isActive: true,
      order: 5,
      price: '$1000 - $15000',
      duration: '2-6 weeks',
      features: ['Machine Learning', 'NLP Integration', 'Computer Vision', 'Predictive Analytics'],
      tags: ['ai', 'ml', 'machine-learning', 'automation']
    },
    {
      _id: '6',
      title: 'Digital Marketing',
      description: 'Strategic campaigns that amplify your brand and drive sustainable business growth.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      color: 'from-orange-500 to-red-500',
      icon: 'TrendingUp',
      category: 'Marketing',
      isActive: true,
      order: 6,
      price: '$500 - $5000/month',
      duration: 'Ongoing',
      features: ['SEO Strategy', 'Social Media', 'Content Marketing', 'Analytics'],
      tags: ['marketing', 'seo', 'social-media', 'analytics']
    }
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('active', 'true'); // Only show active services
      params.append('limit', '50');
      
      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching services from:', url); // Debug log
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Remove cache to avoid stale data
        cache: 'no-cache'
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Services API response:', data); // Debug log
      
      const apiServices = data.data || [];
      
      // If API returns services, use them. Otherwise use default services.
      if (apiServices.length > 0) {
        setServices(apiServices);
      } else {
        // Filter default services by category if needed
        const filteredDefault = selectedCategory !== 'all' 
          ? defaultServices.filter(service => service.category === selectedCategory)
          : defaultServices;
        setServices(filteredDefault);
      }
    } catch (err) {
      console.error('Error fetching services, using default data:', err);
      setError('Using demo data - API unavailable');
      
      // Use default services filtered by category and search
      let filteredDefault = selectedCategory !== 'all' 
        ? defaultServices.filter(service => service.category === selectedCategory)
        : defaultServices;
      
      // Apply search filter to default data
      if (searchQuery) {
        filteredDefault = filteredDefault.filter(service =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setServices(filteredDefault);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Development', 'Design', 'Marketing', 'Cloud', 'AI', 'Other'];

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Our Services
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions tailored to your unique business needs
            </p>
          </div>
        </AnimatedSection>

        {/* Error Banner */}
        {error && (
          <AnimatedSection>
            <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center max-w-2xl mx-auto">
              <p className="text-yellow-400 text-sm">
                {error} - Showing demo services
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Search and Filter Section */}
        <AnimatedSection>
          <div className="mb-12 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <Filter className="w-5 h-5" />
                <span className="text-sm">Filter by:</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white border border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  {cat === 'all' ? 'All Services' : cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <span className="ml-3 text-gray-400">Loading services...</span>
          </div>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Code;
              
              return (
                <AnimatedSection key={service._id || service.id} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          // Fallback image if the main image fails to load
                          e.target.src = 'https://images.unsplash.com/photo-1556655848-f3a7049761e4?w=600&q=80';
                        }}
                      />
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-semibold">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Features List */}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-xs text-gray-500 pl-3.5">
                              +{service.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      )}

                      {/* Price and Duration */}
                      <div className="flex items-center justify-between mb-4 text-sm">
                        {service.price && (
                          <span className="text-purple-400 font-semibold">{service.price}</span>
                        )}
                        {service.duration && (
                          <span className="text-gray-500">{service.duration}</span>
                        )}
                      </div>

                      <button className="mt-auto text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all hover:text-purple-300">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 text-xl mb-2">No services found</p>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No services available at the moment'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Process Section */}
        <AnimatedSection>
          <div className="mt-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              A streamlined approach to deliver exceptional results
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: '01', title: 'Discovery', desc: 'Understanding your vision and goals' },
                { step: '02', title: 'Planning', desc: 'Strategic roadmap and architecture' },
                { step: '03', title: 'Development', desc: 'Building with best practices' },
                { step: '04', title: 'Launch', desc: 'Deployment and ongoing support' }
              ].map((process, i) => (
                <div 
                  key={i}
                  className="relative p-6 bg-slate-800/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className="text-4xl sm:text-5xl font-black text-purple-500/20 mb-4 group-hover:text-purple-500/30 transition-colors">
                    {process.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{process.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{process.desc}</p>
                  
                  {/* Connector lines for desktop */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}