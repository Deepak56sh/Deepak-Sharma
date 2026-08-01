'use client';
import { Image } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function MediaPage() {
  return (
    <PlaceholderPage
      icon={Image}
      title="Media"
      description="Upload and manage images used across the store."
      primaryLabel="Add New"
    />
  );
}
