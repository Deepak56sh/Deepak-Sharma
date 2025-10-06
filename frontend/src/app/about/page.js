// src/app/about/page.js - CONVERTED TO CLIENT COMPONENT
'use client';
import { useState, useEffect } from 'react';
import { Users, Target, Award, TrendingUp } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Icon mapping
const iconMap = {
  'Projects Completed': Award,
  'Happy Clients': Users,
  'Awards Won': Target,
  'Satisfaction Rate': TrendingUp
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FUNCTION TO FIX IMAGE PATHS
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads
    if (imagePath.startsWith('/uploads/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${apiUrl}${imagePath}`;
    }
    
    // If it's just a filename (without /uploads/)
    if (imagePath.includes('about-')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${apiUrl}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch about data');
        }

        const result = await res.json();
        setAboutData(result.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
        // Set default data if API fails
        setAboutData({
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
        });
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

  if (!aboutData) {
    return (
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-400">Failed to load about page data</p>
        </div>
      </div>
    );
  }

  // ✅ USE THE FUNCTION TO GET CORRECT IMAGE URLs
  const heroImageUrl = getFullImageUrl(aboutData.heroImage);
  const teamImageUrl = getFullImageUrl(aboutData.teamImage);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient">{aboutData.title}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {aboutData.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              {/* ✅ NOW CAN USE onError SINCE IT'S CLIENT COMPONENT */}
              <img 
                src={heroImageUrl} 
                alt="Team collaboration" 
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  console.error('Image failed to load:', heroImageUrl);
                  // Fallback to default image
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80';
                }}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">{aboutData.mainHeading}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {aboutData.description1}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {aboutData.description2}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Team Image Section */}
        {/* {teamImageUrl && (
          <AnimatedSection>
            <div className="mb-20">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src={teamImageUrl} 
                  alt="Our team" 
                  className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    console.error('Team image failed to load:', teamImageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </AnimatedSection>
        )} */}

        {/* Additional Images Gallery */}
        {aboutData.additionalImages && aboutData.additionalImages.length > 0 && (
          <AnimatedSection>
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-white text-center mb-8">Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutData.additionalImages.map((image, index) => {
                  const galleryImageUrl = getFullImageUrl(image.url);
                  return (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img 
                        src={galleryImageUrl} 
                        alt={image.altText || 'Gallery image'} 
                        className="relative rounded-2xl shadow-xl w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          console.error('Gallery image failed to load:', galleryImageUrl);
                          e.target.src = 'https://via.placeholder.com/400x300/1f2937/9ca3af?text=Image+Not+Found';
                        }}
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-4 rounded-b-2xl">
                          <p className="text-sm">{image.caption}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {aboutData.stats.map((stat, i) => {
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
                  <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
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

          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.values.map((value, i) => (
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