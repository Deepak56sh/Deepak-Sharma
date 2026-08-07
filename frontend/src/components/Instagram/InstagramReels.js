'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const fallbackReels = [
  {
    _id: '1',
    video: 'https://cdn.coverr.co/videos/coverr-watering-a-plant-2652/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80',
    title: 'Watering tips',
  },
  {
    _id: '2',
    video: 'https://cdn.coverr.co/videos/coverr-green-plant-leaves-1586/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    title: 'New arrivals',
  },
  {
    _id: '3',
    video: 'https://cdn.coverr.co/videos/coverr-a-plant-in-a-pot-5635/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=400&q=80',
    title: 'Pot styling',
  },
];

export default function InstagramReels({ title = 'Follow Us on Instagram', subtitle = 'Hover to play · Click to watch full' }) {
  const [reels, setReels] = useState(fallbackReels);
  const [popupReel, setPopupReel] = useState(null);
  const hoverRefs = useRef({});

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch(`${API_URL}/instagram`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.length) {
          setReels(data.data);
        }
      } catch {
        // keep fallback
      }
    };
    fetchReels();
  }, []);

  const handleEnter = (id) => {
    const el = hoverRefs.current[id];
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  const handleLeave = (id) => {
    const el = hoverRefs.current[id];
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  if (!reels.length) return null;

  return (
    <section className="py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14261d]">{title}</h2>
          <p className="text-[#6b7280] text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {reels.map((reel) => (
            <button
              key={reel._id}
              type="button"
              onClick={() => setPopupReel(reel)}
              onMouseEnter={() => handleEnter(reel._id)}
              onMouseLeave={() => handleLeave(reel._id)}
              className="relative flex-shrink-0 w-[160px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#14261d] snap-start group cursor-pointer border border-[#e8ece9] hover:border-[#2f9e44]/40 transition-all"
            >
              <video
                ref={(el) => {
                  if (el) hoverRefs.current[reel._id] = el;
                }}
                src={reel.video}
                poster={reel.poster}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {reel.title && (
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium line-clamp-2 text-left">
                  {reel.title}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {popupReel && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPopupReel(null)}
        >
          <div
            className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPopupReel(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={popupReel.video}
              poster={popupReel.poster}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}