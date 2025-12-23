'use client';
import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Github, Instagram, Facebook, Linkedin } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'NexGen',
    siteTagline: 'Digital Innovation',
    contactEmail: 'hello@nexgen.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: 'San Francisco, CA',
    socialGithub: 'https://github.com/nexgen',
    socialInstagram: 'https://instagram.com/nexgen',
    socialFacebook: 'https://facebook.com/nexgen',
    socialLinkedin: 'https://linkedin.com/company/nexgen',
    businessHours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day, value) => {
    setSettings({
      ...settings,
      businessHours: { ...settings.businessHours, [day]: value }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();

      if (data.success) {
        alert('Settings updated successfully!');
        setSettings(data.data);
      } else {
        alert(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Site Tagline</label>
            <input
              type="text"
              name="siteTagline"
              value={settings.siteTagline}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <input
              type="text"
              name="contactAddress"
              value={settings.contactAddress}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Social Media Links</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </label>
            <input
              type="url"
              name="socialGithub"
              value={settings.socialGithub}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Instagram
            </label>
            <input
              type="url"
              name="socialInstagram"
              value={settings.socialInstagram}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              Facebook
            </label>
            <input
              type="url"
              name="socialFacebook"
              value={settings.socialFacebook}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="https://facebook.com/yourpagename"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </label>
            <input
              type="url"
              name="socialLinkedin"
              value={settings.socialLinkedin}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Business Hours</h2>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Monday - Friday</label>
              <input
                type="text"
                value={settings.businessHours.weekdays}
                onChange={(e) => handleHoursChange('weekdays', e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Saturday</label>
              <input
                type="text"
                value={settings.businessHours.saturday}
                onChange={(e) => handleHoursChange('saturday', e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Sunday</label>
            <input
              type="text"
              value={settings.businessHours.sunday}
              onChange={(e) => handleHoursChange('sunday', e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}