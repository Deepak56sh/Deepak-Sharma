// components/DynamicFavicon.js
'use client';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function DynamicFavicon() {
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.siteFavicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.data.siteFavicon;
        }
      })
      .catch(() => {});
  }, []);

  return null;
}