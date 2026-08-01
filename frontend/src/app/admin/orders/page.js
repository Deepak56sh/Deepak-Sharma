'use client';
import { ShoppingBag } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function OrdersPage() {
  return (
    <PlaceholderPage
      icon={ShoppingBag}
      title="Orders"
      description="Track and manage customer orders."
      primaryLabel="Add New"
    />
  );
}
