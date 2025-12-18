'use client';
import { useState, useEffect } from 'react';
import { Users, Target, Award, TrendingUp, AlertCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const iconMap = {
  'Projects Completed': Award,
  'Happy Clients': Users,
  'Awards Won': Target,
  'Satisfaction Rate': TrendingUp
};

const defaultAboutData = {
  title: 'About Us',
  subtitle: 'Crafting digital experiences that inspire and innovate',
  mainHeading: 'We Build Digital Dreams',
  description1: 'We\'re a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what\'s possible in the digital realm.',
  description2: 'With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.',
  teamImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  stats: [
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '15+', label: 'Awards Won' },
    { number: '99%', label: 'Satisfaction Rate' }
  ],
  values: [
    {
      title: 'Innovation First',
      description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',
      emoji: '🚀'
    },
    {
      title: 'Client Success',
      description: 'Your success is our success. We are committed to exceeding expectations on every project.',
      emoji: '🎯'
    },
    {
      title: 'Quality Driven',
      description: 'We never compromise on quality, ensuring every detail is perfect before delivery.',
      emoji: '⭐'
    }
  ]
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIXED: Correct image URL construction
  const getFullImageUrl = (imagePath) => {
    console.log('🖼️ Original image path:', imagePath);
    
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80';
    }
    
    // If already full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // ✅ FIX: For /uploads paths, construct proper URL
    if (imagePath.startsWith('/uploads/')) {
      // Remove /api if present (for consistency)
      let cleanPath = imagePath;
      if (cleanPath.startsWith('/api')) {
        cleanPath = cleanPath.replace('/api', '');
      }
      
      // ✅ Use BASE URL (without /api) for static files
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
      
      // Ensure no double slashes
      const finalUrl = BASE_URL + cleanPath.replace(/^\/+/, '/');
      
      console.log('🖼️ Constructed URL:', {
        input: imagePath,
        base: BASE_URL,
        cleanPath: cleanPath,
        output: finalUrl
      });
      
      return finalUrl;
    }
    
    // If it's just a filename, assume it's in uploads
    if (!imagePath.includes('/')) {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
      return `${BASE_URL}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // ✅ FIXED: Use correct API endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
        
        const res = await fetch(`${apiUrl}/about`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        console.log('📥 Fetch response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('📥 Fetched about data:', result);
        
        if (result.success && result.data) {
          console.log('🖼️ Team image from API:', result.data.teamImage);
          setAboutData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (error) {
        console.error('❌ Error fetching about data:', error);
        setError(error.message);
        setAboutData(defaultAboutData);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading about page...</p>
        </div>
      </div>
    );
  }

  const dataToUse = aboutData || defaultAboutData;
  const teamImageUrl = getFullImageUrl(dataToUse.teamImage);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {error && (
          <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-400 text-sm">
              Using demo data - API Error: {error}
            </p>
          </div>
        )}

        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {dataToUse.title}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {dataToUse.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content with Team Image */}
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img 
                src={teamImageUrl} 
                alt="Our Team" 
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  console.error('❌ Image failed to load:', teamImageUrl);
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80';
                }}
                onLoad={() => console.log('✅ Image loaded:', teamImageUrl)}
              />
              {/* Debug info */}
              {/* <div className="mt-2 text-xs text-gray-500">
                <div className="truncate">URL: {teamImageUrl.substring(0, 50)}...</div>
              </div> */}
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">{dataToUse.mainHeading}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {dataToUse.description1}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {dataToUse.description2}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {dataToUse.stats.map((stat, i) => {
              const IconComponent = iconMap[stat.label] || Award;
              return (
                <div 
                  key={i} 
                  className="text-center p-6 bg-slate-800/50 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataToUse.values.map((value, i) => (
              <div 
                key={i}
                className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{value.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}