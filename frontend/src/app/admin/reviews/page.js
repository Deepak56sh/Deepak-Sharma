'use client';
import { Star } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function ReviewsPage() {
  return (
    <PlaceholderPage
      icon={Star}
      title="Reviews"
      description="Moderate customer reviews and ratings."
      primaryLabel="Add New"
    />
  );
}
