// ============================================
// FILE: src/app/about/page.js (ABOUT PAGE)
// ============================================
import { Users, Target, Award, TrendingUp } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient">About Us</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Crafting digital experiences that inspire and innovate
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                alt="Team collaboration" 
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">We Build Digital Dreams</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We're a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what's possible in the digital realm.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { num: '500+', label: 'Projects Completed', icon: Award },
              { num: '50+', label: 'Happy Clients', icon: Users },
              { num: '15+', label: 'Awards Won', icon: Target },
              { num: '99%', label: 'Satisfaction Rate', icon: TrendingUp }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center p-6 bg-slate-800/50 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gradient mb-2">{stat.num}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
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
            {[
              {
                title: 'Innovation First',
                desc: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',
                icon: '🚀'
              },
              {
                title: 'Client Success',
                desc: 'Your success is our success. We are committed to exceeding expectations on every project.',
                icon: '🎯'
              },
              {
                title: 'Quality Driven',
                desc: 'We never compromise on quality, ensuring every detail is perfect before delivery.',
                icon: '⭐'
              }
            ].map((value, i) => (
              <div 
                key={i}
                className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
