'use client';
import { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2f9e44]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2f9e44]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#2f9e44]/15 rounded-full" />
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-[#2f9e44] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout className="w-10 h-10 text-[#2f9e44]" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Plantora</h2>
          <p className="text-slate-400">Growing your experience...</p>
        </div>

        <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-[#2f9e44] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-[#2f9e44] font-semibold">{progress}%</div>
      </div>
    </div>
  );
}