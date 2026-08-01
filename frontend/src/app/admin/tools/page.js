'use client';
import { Wrench } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function ToolsPage() {
  return (
    <PlaceholderPage
      icon={Wrench}
      title="Tools"
      description="Import/export data and store utilities."
      primaryLabel="Add New"
    />
  );
}
