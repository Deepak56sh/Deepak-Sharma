// ============================================
// FILE: src/app/page.js (HOME PAGE)
// ============================================
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe, Star } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <AnimatedSection>
            <div className="inline-block mb-6 px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm">
              <span className="text-purple-300 text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 animate-spin" style={{animationDuration: '3s'}} />
                Welcome to the Future
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="text-gradient animate-gradient bg-[length:200%_200%]">
                Digital Innovation
              </span>
              <br />
              <span className="text-white">Starts Here</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-full text-white font-semibold text-lg hover:bg-slate-800 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
                Get in Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: 'Lightning Fast', 
                desc: 'Optimized performance for seamless user experiences that load instantly',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Shield, 
                title: 'Secure & Reliable', 
                desc: 'Enterprise-grade security protocols you can trust with your data',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: Globe, 
                title: 'Global Reach', 
                desc: 'Connect with audiences worldwide through scalable solutions',
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let's collaborate and bring your ideas to life with innovative solutions
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
