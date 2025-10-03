// ============================================
// FILE: src/app/services/page.js (SERVICES PAGE - Connected to Backend)
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Code, Smartphone, Palette, Cloud, Brain, TrendingUp, Database, Lock, Globe, Zap, Loader2 } from 'lucide-react';
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
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = selectedCategory !== 'all' ? `?category=${selectedCategory}&active=true` : '?active=true';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services${query}`);
      
      if (!res.ok) throw new Error('Failed to fetch services');
      
      const data = await res.json();
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
      
      // Use default services filtered by category
      const filteredDefault = selectedCategory !== 'all' 
        ? defaultServices.filter(service => service.category === selectedCategory)
        : defaultServices;
      setServices(filteredDefault);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Development', 'Design', 'Marketing', 'Cloud', 'AI', 'Other'];

  // Show services even when there's an error (since we have default data)
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient">Our Services</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions tailored to your unique business needs
            </p>
          </div>
        </AnimatedSection>

        {/* Error Banner */}
        {error && (
          <AnimatedSection>
            <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
              <p className="text-yellow-400">
                {error} - Showing demo services
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Category Filter */}
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:text-white border border-purple-500/20'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Services Grid */}
        {!loading && displayServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Code;
              
              return (
                <AnimatedSection key={service._id} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
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
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Features List */}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
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

                      <button className="text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}

        {/* Empty State - Only show if both API and default data are empty */}
        {!loading && displayServices.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No services found in this category</p>
            <p className="text-gray-500 text-sm">
              Try selecting a different category or check back later
            </p>
          </div>
        )}

        {/* Process Section */}
        <AnimatedSection>
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              A streamlined approach to deliver exceptional results
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Discovery', desc: 'Understanding your vision and goals' },
                { step: '02', title: 'Planning', desc: 'Strategic roadmap and architecture' },
                { step: '03', title: 'Development', desc: 'Building with best practices' },
                { step: '04', title: 'Launch', desc: 'Deployment and ongoing support' }
              ].map((process, i) => (
                <div 
                  key={i}
                  className="relative p-6 bg-slate-800/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="text-6xl font-black text-purple-500/20 mb-4">{process.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{process.title}</h3>
                  <p className="text-gray-400 text-sm">{process.desc}</p>
                  
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
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