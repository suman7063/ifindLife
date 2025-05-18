
import { AdminUser } from './types';

// Default admin users for the system
export const defaultAdminUsers: AdminUser[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    username: 'IFLsuperadmin',
    email: 'IFLsuperadmin@ifindlife.com',
    role: 'super_admin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: true,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    },
    createdAt: new Date().toISOString()
  }
];
