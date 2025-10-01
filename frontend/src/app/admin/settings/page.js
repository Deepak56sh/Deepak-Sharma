// ============================================
// FILE: src/app/admin/settings/page.js
// ============================================
'use client';
import { useState } from 'react';
import { Save, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'NexGen',
    siteTagline: 'Digital Innovation',
    contactEmail: 'hello@nexgen.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: 'San Francisco, CA',
    socialGithub: 'https://github.com/nexgen',
    socialTwitter: 'https://twitter.com/nexgen',
    socialLinkedin: 'https://linkedin.com/company/nexgen',
    businessHours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day, value) => {
    setSettings({
      ...settings,
      businessHours: { ...settings.businessHours, [day]: value }
    });
  };

  const handleSave = () => {
    alert('Settings updated successfully! (In production, this will update the database)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
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
              <Twitter className="w-4 h-4" />
              Twitter
            </label>
            <input
              type="url"
              name="socialTwitter"
              value={settings.socialTwitter}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
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