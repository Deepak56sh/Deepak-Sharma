// src/app/page.js - FULLY RESPONSIVE VERSION
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Zap, Shield, Globe, ExternalLink } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

export default function HomePage() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${API_URL}/hero`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch hero data');
        }

        const result = await res.json();
        setHeroData(result.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Set default data if API fails
        setHeroData({
          badge: 'Welcome to the Future',
          mainTitle: 'Digital Innovation',
          subTitle: 'Starts Here',
          description: 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience',
          primaryButton: 'Explore Services',
          primaryButtonType: 'page',
          primaryButtonLink: '/services',
          secondaryButton: 'Get in Touch',
          secondaryButtonType: 'page',
          secondaryButtonLink: '/contact'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Function to render button based on type
  const renderButton = (buttonData, isPrimary = true) => {
    const buttonClass = isPrimary 
      ? "group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
      : "px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-full text-white font-semibold text-base sm:text-lg hover:bg-slate-800 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto";

    // ✅ ADD PROPER FALLBACKS FOR ALL PROPERTIES
    const text = buttonData.text || 'Button';
    const type = buttonData.type || 'page';
    const link = buttonData.link || (isPrimary ? '/services' : '/contact');

    if (type === 'external') {
      return (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {text}
          {isPrimary ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" /> : <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />}
        </a>
      );
    } else {
      return (
        <Link href={link} className={buttonClass}>
          {text}
          {isPrimary && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />}
        </Link>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-base sm:text-lg">Failed to load hero section</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-pink-500 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-16 sm:pt-20">
          <AnimatedSection>
            <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm">
              <span className="text-purple-300 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" style={{animationDuration: '3s'}} />
                {heroData.badge || 'Welcome to the Future'}
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="text-gradient animate-gradient bg-[length:200%_200%] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                {heroData.mainTitle || 'Digital Innovation'}
              </span>
              <br />
              <span className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl">{heroData.subTitle || 'Starts Here'}</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              {heroData.description || 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience'}
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xs sm:max-w-none mx-auto">
              {/* Primary Button */}
              {renderButton({
                text: heroData.primaryButton,
                type: heroData.primaryButtonType,
                link: heroData.primaryButtonLink
              }, true)}
              
              {/* Secondary Button */}
              {renderButton({
                text: heroData.secondaryButton,
                type: heroData.secondaryButtonType,
                link: heroData.secondaryButtonLink
              }, false)}
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1.5 h-2 sm:h-3 bg-purple-400 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-slate-900/50">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: Zap,
                title: 'Lightning Fast', 
                desc: 'Every website I build is optimized for speed, performance, and seamless user experience — ensuring your visitors stay longer and convert better.',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Shield,
                title: 'Secure & Reliable', 
                desc: 'Clean, scalable, and well-structured code with best industry practices, ensuring long-term stability and security for your business.',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: Globe,
                title: 'Global Reach', 
                desc: 'Connect with audiences I build responsive, cross-platform, and SEO-friendly websites that help businesses connect with audiences anywhere in the world. through scalable solutions',
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="group p-6 sm:p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl sm:rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Build Something Exceptional?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
              Let&apos;s collaborate and turn your vision into a powerful digital presence with stunning frontend development.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-base sm:text-lg hover:shadow-xl sm:hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center">
              Get Started Today
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}