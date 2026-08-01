'use client';
import { FileText } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function BlogsPage() {
  return (
    <PlaceholderPage
      icon={FileText}
      title="Blogs"
      description="Publish plant care guides and articles."
      primaryLabel="Add New"
    />
  );
}
