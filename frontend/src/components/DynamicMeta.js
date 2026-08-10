'use client';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function DynamicMeta() {
  useEffect(() => {
    const updateMeta = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const { siteName, siteTagline } = data.data;
          
          // ✅ Update Title
          if (siteName) {
            document.title = siteName;
          }
          
          // ✅ Update Meta Description
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
          }
          if (siteTagline) {
            metaDescription.content = siteTagline;
          }
          
          // ✅ Update Open Graph (Facebook, LinkedIn, etc.)
          let ogTitle = document.querySelector('meta[property="og:title"]');
          if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
          }
          if (siteName) {
            ogTitle.content = siteName;
          }
          
          let ogDescription = document.querySelector('meta[property="og:description"]');
          if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
          }
          if (siteTagline) {
            ogDescription.content = siteTagline;
          }
          
          // ✅ Update Twitter Card
          let twitterTitle = document.querySelector('meta[name="twitter:title"]');
          if (!twitterTitle) {
            twitterTitle = document.createElement('meta');
            twitterTitle.name = 'twitter:title';
            document.head.appendChild(twitterTitle);
          }
          if (siteName) {
            twitterTitle.content = siteName;
          }
          
          let twitterDescription = document.querySelector('meta[name="twitter:description"]');
          if (!twitterDescription) {
            twitterDescription = document.createElement('meta');
            twitterDescription.name = 'twitter:description';
            document.head.appendChild(twitterDescription);
          }
          if (siteTagline) {
            twitterDescription.content = siteTagline;
          }
          
          console.log('✅ Meta tags updated:', { siteName, siteTagline });
        }
      } catch (error) {
        console.error('❌ Meta update error:', error);
      }
    };

    updateMeta();
  }, []);

  return null;
}