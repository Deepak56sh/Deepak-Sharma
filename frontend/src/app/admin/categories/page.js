'use client';
import { Grid3x3 } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function CategoriesPage() {
  return (
    <PlaceholderPage
      icon={Grid3x3}
      title="Categories"
      description="Organize plants into browsable categories."
      primaryLabel="Add New"
    />
  );
}
