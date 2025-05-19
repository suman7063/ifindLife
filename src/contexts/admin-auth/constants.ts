
import { AdminUser } from './types';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@ifindlife.com',
    username: 'admin',
    role: 'admin',
    permissions: {
      canManageUsers: false,
      canManageExperts: false,
      canManageContent: true,
      canViewAnalytics: true,
      canManageServices: true,
      canManagePrograms: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'superadmin@ifindlife.com',
    username: 'superadmin',
    role: 'superadmin',
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
    lastLogin: new Date().toISOString()
  },
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
    lastLogin: new Date().toISOString()
  }
];

// Define test credentials that match what's displayed to users
export const testCredentials = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  superadmin: {
    username: 'superadmin',
    password: 'super123',
    role: 'superadmin'
  },
  iflsuperadmin: {
    username: 'IFLsuperadmin',
    password: 'Freesoul@99IFL',
    role: 'super_admin'
  }
};
