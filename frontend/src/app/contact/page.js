// src/app/contact/page.js - FULLY RESPONSIVE VERSION
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
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6">
              <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
              Let&apos;s create something exceptional together. I'm here to help bring your ideas to life with modern, high-quality frontend development.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Left Side - Contact Info */}
          <AnimatedSection>
            <div className="space-y-6 sm:space-y-8">
              {/* Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 group-hover:opacity-30 sm:group-hover:opacity-40 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80" 
                  alt="Contact us" 
                  className="relative rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl w-full h-48 sm:h-60 lg:h-72 xl:h-80 object-cover"
                />
              </div>

              {/* Contact Cards - Dynamic from settings */}
              <div className="space-y-4 sm:space-y-6">
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
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-slate-800/50 rounded-xl sm:rounded-2xl border border-purple-500/10 hover:border-purple-500/20 sm:hover:border-purple-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 sm:group-hover:scale-110 transition-transform flex-shrink-0">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1">{item.title}</div>
                      <div className="text-white font-semibold text-sm sm:text-base lg:text-lg truncate">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Business Hours - Dynamic from settings */}
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl sm:rounded-2xl border border-purple-500/10">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Business Hours</h3>
                <div className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
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
            <div className="bg-slate-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-purple-500/10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 lg:py-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-bounce">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm sm:text-base">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {error && (
                    <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg sm:rounded-xl text-red-300 text-xs sm:text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Your Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-slate-900/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-slate-900/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Subject</label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?" 
                      className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-slate-900/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4" 
                      placeholder="Tell us about your project..." 
                      className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-slate-900/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none text-sm sm:text-base"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl text-white font-semibold text-sm sm:text-base lg:text-lg hover:shadow-xl sm:hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* FAQ Section */}
        <AnimatedSection>
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto">
              {[
                {
                  q: 'What is your typical project timeline?',
                  a: 'Project time depends on the scope, but most websites and applications take 1–4 weeks to complete.'
                },
                {
                  q: 'Do you offer ongoing support?',
                  a: 'Yes, I provide maintenance & support packages to keep your website secure, updated, and performing well.'
                },
                {
                  q: 'What technologies do you work with?',
                  a: 'I specialize in React, Next.js, HTML, CSS, JavaScript, Tailwind, and API integrations.'
                },
                {
                  q: 'How do you handle project pricing?',
                  a: 'I offer both fixed-price and hourly models depending on project requirements. Contact me for a custom quote.'
                }
              ].map((faq, i) => (
                <div 
                  key={i}
                  className="p-4 sm:p-5 lg:p-6 bg-slate-800/50 rounded-xl sm:rounded-2xl border border-purple-500/10 hover:border-purple-500/20 sm:hover:border-purple-500/30 transition-all"
                >
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{faq.q}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}