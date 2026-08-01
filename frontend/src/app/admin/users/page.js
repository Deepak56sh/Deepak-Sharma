'use client';
import { UserCog } from 'lucide-react';
import PlaceholderPage from '@/components/admin/PlaceholderPage';

export default function UsersRolesPage() {
  return (
    <PlaceholderPage
      icon={UserCog}
      title="Users & Roles"
      description="Manage admin users and permissions."
      primaryLabel="Add New"
    />
  );
}
