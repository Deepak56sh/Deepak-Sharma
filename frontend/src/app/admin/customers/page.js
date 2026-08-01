'use client';
import { Users } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function CustomersPage() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Customers"
      description="View and manage registered customers."
      primaryLabel="Add New"
    />
  );
}
