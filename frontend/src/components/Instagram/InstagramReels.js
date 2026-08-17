'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, X, Instagram } from 'lucide-react';

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

// ✅ NEW: apna Instagram account/profile URL yahan daal dijiye (ya prop se pass kar dijiye).
// Yeh alag hai reel.link se — reel.link ek specific post/reel ka link hota hai,
// jabki yeh button seedha aapke MAIN Instagram account pe le jayega.
const DEFAULT_INSTAGRAM_PROFILE_URL = 'https://instagram.com/plantora';

export default function InstagramReels({
  title = 'Follow Us on Instagram',
  subtitle = 'Hover to play · Click to watch full',
  profileUrl = DEFAULT_INSTAGRAM_PROFILE_URL,
}) {
  const [reels, setReels] = useState(fallbackReels);
  const [popupReel, setPopupReel] = useState(null);
  const hoverRefs = useRef({});
  const popupVideoRef = useRef(null); // ref for the popup video so we can explicitly play() it with sound

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

  // whenever the popup opens with a reel, explicitly unmute + play with sound.
  // Relying only on the `autoPlay` attribute is unreliable for audio because the
  // <video> element mounts a tick after the click (state update), which some
  // browsers no longer treat as tightly tied to the user gesture. Calling
  // .play() ourselves right after mount keeps it linked to the click.
  useEffect(() => {
    if (popupReel && popupVideoRef.current) {
      const video = popupVideoRef.current;
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay-with-sound was blocked by the browser — controls are
          // still visible so the user can press play manually.
        });
      }
    }
  }, [popupReel]);

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

  // Click hamesha video popup kholega — hover-preview + click-popup wahi
  // purana behaviour hai. Instagram link (agar admin ne diya ho) ab popup
  // ke andar ek separate button ke roop me milta hai, click ko replace nahi karta.
  const handleCardClick = (reel) => {
    setPopupReel(reel);
  };

  const closePopup = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
    }
    setPopupReel(null);
  };

  if (!reels.length) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8 gap-3">
          {/* Instagram account icon — click karte hi seedha real Instagram account khulega naye tab me */}
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram account"
              title="Visit our Instagram account"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)' }}
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14261d] break-words">{title}</h2>
            <p className="text-[#6b7280] text-xs sm:text-sm mt-1 break-words">{subtitle}</p>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {reels.map((reel) => (
            <button
              key={reel._id}
              type="button"
              onClick={() => handleCardClick(reel)}
              onMouseEnter={() => handleEnter(reel._id)}
              onMouseLeave={() => handleLeave(reel._id)}
              title={reel.title}
              className="relative flex-shrink-0 w-[140px] xs:w-[160px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#14261d] snap-start group cursor-pointer border border-[#e8ece9] hover:border-[#2f9e44]/40 transition-all"
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

              {/* Play icon — click karne se hamesha video popup khulega */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Chhota Instagram badge — sirf yeh dikhane ke liye ki is reel ka Instagram link bhi hai (popup ke andar khulega) */}
              {reel.link && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                  <Instagram className="w-3 h-3 text-white" />
                </div>
              )}

              {reel.title && (
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium line-clamp-2 text-left break-words">
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
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              ref={popupVideoRef}
              src={popupReel.video}
              poster={popupReel.poster}
              autoPlay
              controls
              playsInline
              muted={false}
              className="w-full h-full object-contain"
            />

            {/* Optional — sirf tab dikhta hai jab is reel ka Instagram link admin ne diya ho */}
            {popupReel.link && (
              <a
                href={popupReel.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)' }}
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                View on Instagram
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}