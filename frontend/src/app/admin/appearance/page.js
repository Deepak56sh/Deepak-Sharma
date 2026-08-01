'use client';
import { Palette } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function AppearancePage() {
  return (
    <PlaceholderPage
      icon={Palette}
      title="Appearance"
      description="Customize storefront theme and banners."
      primaryLabel="Add New"
    />
  );
}
