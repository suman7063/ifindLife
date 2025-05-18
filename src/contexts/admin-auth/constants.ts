
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
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'admin',
    email: 'admin@ifindlife.com',
    role: 'admin',
    permissions: {
      canManageContent: true,
      canViewAnalytics: true
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'superadmin',
    email: 'superadmin@ifindlife.com',
    role: 'superadmin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: true,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: true,
      canApproveExperts: true
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];
