'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient">Get In Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Let&apos;s create something amazing together. We're here to help bring your vision to life.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <AnimatedSection>
            <div className="space-y-8">
              {/* Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80" 
                  alt="Contact us" 
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
                />
              </div>

              {/* Contact Cards - Dynamic from settings */}
              <div className="space-y-6">
                {[
                  { 
                    icon: Mail, 
                    title: 'Email', 
                    value: settings?.contactEmail || 'hello@nexgen.com',
                    link: `mailto:${settings?.contactEmail || 'hello@nexgen.com'}`
                  },
                  { 
                    icon: Phone, 
                    title: 'Phone', 
                    value: settings?.contactPhone || '+1 (555) 123-4567',
                    link: `tel:${settings?.contactPhone || '+15551234567'}`
                  },
                  { 
                    icon: MapPin, 
                    title: 'Location', 
                    value: settings?.contactAddress || 'San Francisco, CA',
                    link: '#'
                  }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="flex items-center gap-4 p-6 bg-slate-800/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">{item.title}</div>
                      <div className="text-white font-semibold text-lg">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Business Hours - Dynamic from settings */}
              <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-500/10">
                <h3 className="text-2xl font-bold text-white mb-4">Business Hours</h3>
                <div className="space-y-3 text-gray-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-white font-semibold">
                      {settings?.businessHours?.weekdays || '9:00 AM - 6:00 PM'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="text-white font-semibold">
                      {settings?.businessHours?.saturday || '10:00 AM - 4:00 PM'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-white font-semibold">
                      {settings?.businessHours?.sunday || 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Side - Contact Form */}
          <AnimatedSection>
            <div className="bg-slate-800/50 rounded-3xl p-8 border border-purple-500/10">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Your Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full px-6 py-4 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      className="w-full px-6 py-4 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Subject</label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?" 
                      className="w-full px-6 py-4 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6" 
                      placeholder="Tell us about your project..." 
                      className="w-full px-6 py-4 bg-slate-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* FAQ Section */}
        <AnimatedSection>
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  q: 'What is your typical project timeline?',
                  a: 'Project timelines vary based on scope, but typically range from 4-12 weeks for most web and mobile projects.'
                },
                {
                  q: 'Do you offer ongoing support?',
                  a: 'Yes! We provide maintenance packages and ongoing support to ensure your project continues to perform optimally.'
                },
                {
                  q: 'What technologies do you work with?',
                  a: 'We specialize in React, Next.js, Node.js, React Native, and various cloud platforms like AWS and Azure.'
                },
                {
                  q: 'How do you handle project pricing?',
                  a: 'We offer both fixed-price and hourly billing options. Contact us for a custom quote based on your needs.'
                }
              ].map((faq, i) => (
                <div 
                  key={i}
                  className="p-6 bg-slate-800/50 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}