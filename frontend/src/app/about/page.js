// src/app/about/page.js - FULLY RESPONSIVE VERSION
'use client';
import { useState, useEffect } from 'react';
import { Users, Target, Award, TrendingUp, AlertCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Icon mapping
const iconMap = {
  'Projects Completed': Award,
  'Happy Clients': Users,
  'Awards Won': Target,
  'Satisfaction Rate': TrendingUp
};

// Default about data
const defaultAboutData = {
  title: 'About Us',
  subtitle: 'Crafting digital experiences that inspire and innovate',
  mainHeading: 'We Build Digital Dreams',
  description1: 'We\'re a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what\'s possible in the digital realm.',
  description2: 'With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.',
  heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  teamImage: '',
  additionalImages: [],
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

  // ✅ FUNCTION TO FIX IMAGE PATHS
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads
    if (imagePath.startsWith('/uploads/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';
      return `${apiUrl}${imagePath}`;
    }
    
    return imagePath;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';
        console.log('🔍 Fetching from:', `${apiUrl}/api/about`);
        
        const res = await fetch(`${apiUrl}/api/about`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Remove cache to avoid stale data
          cache: 'no-cache'
        });

        console.log('🔍 Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('🔍 API Response:', result);
        
        if (result.success && result.data) {
          setAboutData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (error) {
        console.error('❌ Error fetching about data:', error);
        setError(error.message);
        // Set default data if API fails
        setAboutData(defaultAboutData);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // ✅ USE THE FUNCTION TO GET CORRECT IMAGE URLs
  const heroImageUrl = aboutData ? getFullImageUrl(aboutData.heroImage) : '';
  const teamImageUrl = aboutData ? getFullImageUrl(aboutData.teamImage) : '';

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-red-400 text-base sm:text-lg mb-2">Failed to load about page</p>
            <p className="text-gray-400 text-xs sm:text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Error Banner - Show but still display content */}
        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-400 text-xs sm:text-sm">
              Using demo data - API Error: {error}
            </p>
          </div>
        )}

        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6">
              <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {aboutData.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
              {aboutData.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 sm:opacity-30 group-hover:opacity-40 sm:group-hover:opacity-50 transition-opacity duration-500"></div>
              <img 
                src={heroImageUrl} 
                alt="Team collaboration" 
                className="relative rounded-2xl sm:rounded-3xl h-full shadow-xl sm:shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  console.error('Image failed to load:', heroImageUrl);
                  // Fallback to default image
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80';
                }}
              />
            </div>

            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{aboutData.mainHeading}</h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                {aboutData.description1}
              </p>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                {aboutData.description2}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Additional Images Gallery */}
        {aboutData.additionalImages && aboutData.additionalImages.length > 0 && (
          <AnimatedSection>
            <div className="mb-16 sm:mb-20">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-6 sm:mb-8">Gallery</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {aboutData.additionalImages.map((image, index) => {
                  const galleryImageUrl = getFullImageUrl(image.url);
                  return (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur-xl opacity-15 sm:opacity-20 group-hover:opacity-30 sm:group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img 
                        src={galleryImageUrl} 
                        alt={image.altText || 'Gallery image'} 
                        className="relative rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full h-48 sm:h-56 lg:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          console.error('Gallery image failed to load:', galleryImageUrl);
                          e.target.src = 'https://via.placeholder.com/400x300/1f2937/9ca3af?text=Image+Not+Found';
                        }}
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-2 sm:p-3 lg:p-4 rounded-b-xl sm:rounded-b-2xl">
                          <p className="text-xs sm:text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Stats */}
        <AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-16 sm:mb-20">
            {aboutData.stats.map((stat, i) => {
              const IconComponent = iconMap[stat.label] || Award;
              return (
                <div 
                  key={i} 
                  className="text-center p-4 sm:p-5 lg:p-6 bg-slate-800/50 rounded-xl sm:rounded-2xl border border-purple-500/20 hover:border-purple-500/30 sm:hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection>
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Our Core Values</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {aboutData.values.map((value, i) => (
              <div 
                key={i}
                className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl sm:rounded-2xl border border-purple-500/10 hover:border-purple-500/20 sm:hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">{value.emoji}</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}