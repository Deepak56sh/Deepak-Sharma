'use client';
import Link from 'next/link';
import {
  LayoutTemplate,
  Instagram,
  MessageSquareQuote,
  ChevronRight,
} from 'lucide-react';

const mediaSections = [
  {
    name: 'Hero Banner',
    description: 'Home page slider — image & video slides',
    href: '/admin/media/hero-banner',
    icon: LayoutTemplate,
    color: 'bg-[#eaf7ee] text-[#2f9e44]',
  },
  {
    name: 'Instagram Reels',
    description: 'Short videos for the home reels slider',
    href: '/admin/media/instagram',
    icon: Instagram,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    name: 'Testimonials',
    description: 'Customer reviews shown on the homepage',
    href: '/admin/media/testimonials',
    icon: MessageSquareQuote,
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Media</h1>
        <p className="text-slate-500 text-sm">
          Manage images, videos and social content across the store.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaSections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white border border-[var(--pa-border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--pa-primary)]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[var(--pa-primary)] transition-colors" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800 group-hover:text-[var(--pa-primary)]">
                {item.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}