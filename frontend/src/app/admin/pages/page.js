'use client';
import { Layers } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function PagesPage() {
  return (
    <PlaceholderPage
      icon={Layers}
      title="Pages"
      description="Edit static pages like About and Contact."
      primaryLabel="Add New"
    />
  );
}
