
import { AdminUser, AdminRole, AdminPermissions } from '@/contexts/admin-auth/types';

/**
 * Check if the user is a super admin
 */
export const isSuperAdmin = (user: AdminUser | null): boolean => {
  return user?.role === 'superadmin' || user?.role === 'super_admin';
};

/**
 * Check if the user has a specific permission
 */
export const hasPermission = (user: AdminUser | null, permission: string): boolean => {
  // Super admins have all permissions
  if (isSuperAdmin(user)) return true;
  
  // Check if the user has the specific permission
  if (!user?.permissions) return false;
  return Boolean(user.permissions[permission]);
};

/**
 * Check if the user has any of the specified permissions
 */
export const hasAnyPermission = (user: AdminUser | null, permissions?: string[]): boolean => {
  // Super admins have all permissions
  if (isSuperAdmin(user)) return true;
  
  // Without specific permissions, check if user has any permissions
  if (!permissions || permissions.length === 0) {
    return user?.permissions ? Object.values(user.permissions).some(p => Boolean(p)) : false;
  }
  
  // Check if the user has any of the specified permissions
  if (!user?.permissions) return false;
  return permissions.some(p => hasPermission(user, p));
};

/**
 * Check if the user has all the specified permissions
 */
export const hasAllPermissions = (user: AdminUser | null, permissions: string[]): boolean => {
  // Super admins have all permissions
  if (isSuperAdmin(user)) return true;
  
  // Check if the user has all the specified permissions
  if (!user?.permissions) return false;
  return permissions.every(p => hasPermission(user, p));
};

/**
 * Get all permissions available to a user
 */
export const getUserPermissions = (user: AdminUser | null): string[] => {
  if (!user) return [];
  
  // Super admins have all permissions
  if (isSuperAdmin(user)) {
    return Object.keys(defaultPermissionSet);
  }
  
  // Return the permissions that the user has
  if (!user.permissions) return [];
  return Object.entries(user.permissions)
    .filter(([_, hasPermission]) => Boolean(hasPermission))
    .map(([permission, _]) => permission);
};

/**
 * Default permission set for initializing new admin users
 */
export const defaultPermissionSet: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: false,
  canManageContent: false,
  canManageServices: false,
  canManagePrograms: false,
  canViewAnalytics: false,
  canDeleteContent: false,
  canApproveExperts: false,
  canManageBlog: false,
  canManageTestimonials: false
};
