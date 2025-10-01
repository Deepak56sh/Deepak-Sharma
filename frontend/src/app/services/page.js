// ============================================
// FILE: src/app/services/page.js (SERVICES PAGE)
// ============================================
import { ArrowRight, Code, Smartphone, Palette, Cloud, Brain, TrendingUp } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function ServicesPage() {
  const services = [
    {
      title: 'Web Development',
      desc: 'Build responsive, high-performance websites that engage and convert your audience with modern technologies.',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      color: 'from-blue-500 to-cyan-500',
      icon: Code,
      features: ['React & Next.js', 'Responsive Design', 'SEO Optimized', 'Fast Performance']
    },
    {
      title: 'Mobile Apps',
      desc: 'Native and cross-platform mobile solutions for iOS and Android that deliver seamless experiences.',
      img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
      color: 'from-purple-500 to-pink-500',
      icon: Smartphone,
      features: ['iOS & Android', 'Cross-Platform', 'Native Performance', 'App Store Ready']
    },
    {
      title: 'UI/UX Design',
      desc: 'Beautiful, intuitive interfaces that users love to interact with, backed by research and testing.',
      img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
      color: 'from-pink-500 to-rose-500',
      icon: Palette,
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      title: 'Cloud Solutions',
      desc: 'Scalable cloud infrastructure for modern applications with AWS, Azure, and Google Cloud.',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
      color: 'from-indigo-500 to-purple-500',
      icon: Cloud,
      features: ['AWS & Azure', 'Auto Scaling', 'Load Balancing', '99.9% Uptime']
    },
    {
      title: 'AI Integration',
      desc: 'Harness the power of artificial intelligence and machine learning in your products.',
      img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      color: 'from-emerald-500 to-teal-500',
      icon: Brain,
      features: ['Machine Learning', 'NLP Integration', 'Computer Vision', 'Predictive Analytics']
    },
    {
      title: 'Digital Marketing',
      desc: 'Strategic campaigns that amplify your brand and drive sustainable business growth.',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      color: 'from-orange-500 to-red-500',
      icon: TrendingUp,
      features: ['SEO Strategy', 'Social Media', 'Content Marketing', 'Analytics']
    }
  ];

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <AnimatedSection key={i}>
              <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

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
