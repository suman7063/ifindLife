// SECURITY NOTICE: Hardcoded credentials have been removed for security reasons.
// This file now only contains safe configuration constants.

import { AdminUser, AdminPermissions } from './types';

// DEPRECATED: These credentials have been moved to secure backend authentication
export const testCredentials = {
  iflsuperadmin: {
    username: 'DEPRECATED_USE_SECURE_AUTH',
    password: 'DEPRECATED_USE_SECURE_AUTH'
  }
};

// Safe to export - these are just default permission templates
export const ADMIN_TEST_USERNAME = 'DEPRECATED_USE_SECURE_AUTH';
export const ADMIN_TEST_PASSWORD = 'DEPRECATED_USE_SECURE_AUTH';

// Default permissions for admin users - safe to keep
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

// Template admin user data - safe to keep as it doesn't contain real credentials
export const defaultAdminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'admin_template',
    email: 'admin@example.com',
    role: 'super_admin',
    permissions: DEFAULT_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Log warning when old auth system is used
console.warn("SECURITY WARNING: Old admin auth system detected. Please migrate to SecureAdminAuthProvider for enhanced security.");
