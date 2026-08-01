'use client';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data.success) setSettings(data.data);
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
        headers: { 'Content-Type': 'application/json' },
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
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plant-store bg-[#f6f8f7] min-h-screen">
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#14261d] mb-3">Contact Us</h1>
              <p className="text-[#6b7280] max-w-xl mx-auto">
                We&apos;d love to hear from you
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Contact Info */}
            <AnimatedSection>
              <div className="bg-white rounded-3xl border border-[#e8ece9] p-6 sm:p-8 h-full">
                <div className="mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=700&q=80"
                    alt="Contact"
                    className="w-full h-48 sm:h-56 object-cover rounded-2xl"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#2f9e44]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14261d] mb-1">Address</h3>
                      <p className="text-sm text-[#6b7280] leading-relaxed">
                        {settings?.contactAddress || '123 Green Street, Sector 12, Mumbai, Maharashtra 400001'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#2f9e44]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14261d] mb-1">Phone</h3>
                      <p className="text-sm text-[#6b7280]">
                        {settings?.contactPhone || '+91 98765-43210'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#2f9e44]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14261d] mb-1">Email</h3>
                      <p className="text-sm text-[#6b7280]">
                        {settings?.contactEmail || 'hello@plantora.com'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#2f9e44]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14261d] mb-1">Working Hours</h3>
                      <p className="text-sm text-[#6b7280]">
                        Mon - Sat: 10 AM - 7 PM<br />
                        Sun: 10 AM - 5 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right - Form */}
            <AnimatedSection>
              <div className="bg-white rounded-3xl border border-[#e8ece9] p-6 sm:p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-[#eaf7ee] rounded-full flex items-center justify-center mb-5">
                      <CheckCircle className="w-8 h-8 text-[#2f9e44]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#14261d] mb-2">Message Sent!</h3>
                    <p className="text-[#6b7280]">We&apos;ll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#14261d] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rohan Sharma"
                        required
                        className="w-full px-4 py-3 bg-[#f6f8f7] border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#14261d] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rohan@example.com"
                        required
                        className="w-full px-4 py-3 bg-[#f6f8f7] border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#14261d] mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="w-full px-4 py-3 bg-[#f6f8f7] border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#14261d] mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your query..."
                        required
                        className="w-full px-4 py-3 bg-[#f6f8f7] border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}