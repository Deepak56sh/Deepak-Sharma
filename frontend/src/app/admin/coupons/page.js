'use client';
import { Ticket } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function CouponsPage() {
  return (
    <PlaceholderPage
      icon={Ticket}
      title="Coupons"
      description="Create and manage discount coupons."
      primaryLabel="Add New"
    />
  );
}
