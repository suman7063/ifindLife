
import { AdminUser, AdminPermissions } from './types';

// Test credentials for admin authentication
export const testCredentials = {
  iflsuperadmin: {
    username: 'IFLsuperadmin',
    password: 'Admin@123'
  }
};

// Export the credentials for easy access
export const ADMIN_TEST_USERNAME = testCredentials.iflsuperadmin.username;
export const ADMIN_TEST_PASSWORD = testCredentials.iflsuperadmin.password;

// Default permissions for admin users
const DEFAULT_PERMISSIONS: AdminPermissions = {
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
};

// Default admin users data
export const defaultAdminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'IFLsuperadmin',
    email: 'iflsuperadmin@ifindlife.com',
    role: 'super_admin',
    permissions: DEFAULT_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];
