
import { AdminUser } from './types';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: '3',
    email: 'IFLsuperadmin@ifindlife.com',
    username: 'IFLsuperadmin',
    role: 'super_admin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canViewAnalytics: true,
      canManageServices: true,
      canManagePrograms: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true
  }
];

// Define test credentials - only keep IFLsuperadmin
export const testCredentials = {
  iflsuperadmin: {
    username: 'IFLsuperadmin',
    password: 'Freesoul@99IFL',
    role: 'super_admin'
  }
};
