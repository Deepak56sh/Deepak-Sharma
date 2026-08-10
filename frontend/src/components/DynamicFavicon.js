'use client';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const data = await res.json();
        
        if (data.success && data.data?.siteFavicon) {
          const faviconUrl = data.data.siteFavicon;
          
          // Update main favicon
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
          
          // Update apple touch icon
          let appleLink = document.querySelector("link[rel~='apple-touch-icon']");
          if (!appleLink) {
            appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            document.head.appendChild(appleLink);
          }
          appleLink.href = faviconUrl;
          
          console.log('✅ Favicon updated:', faviconUrl);
        }
      } catch (error) {
        console.error('❌ Favicon update error:', error);
      }
    };

    updateFavicon();
  }, []);

  return null;
}