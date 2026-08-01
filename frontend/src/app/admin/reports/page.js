'use client';
import { BarChart3 } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function ReportsPage() {
  return (
    <PlaceholderPage
      icon={BarChart3}
      title="Reports"
      description="Sales and performance reports."
      primaryLabel="Add New"
    />
  );
}
