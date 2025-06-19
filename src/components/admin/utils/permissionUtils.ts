
import { AdminUser, AdminPermissions } from '@/contexts/admin-auth/types';

/**
 * Check if the user has superadmin privileges
 */
export const isSuperAdmin = (user: AdminUser | null): boolean => {
  if (!user) return false;
  return user.role === 'superadmin'; // Fixed: removed comparison with 'super_admin'
};

/**
 * Check if the user has any admin permissions
 */
export const hasAnyPermission = (user: AdminUser | null): boolean => {
  if (!user) return false;
  
  // Super admins always have all permissions
  if (isSuperAdmin(user)) return true;
  
  // Check if user has any permission set to true
  return Object.values(user?.permissions || {}).some(permission => permission === true);
};

/**
 * Check if the user has a specific permission
 */
export const hasPermission = (user: AdminUser | null, permissionName: keyof AdminPermissions | string): boolean => {
  if (!user) return false;
  
  // Super admins always have all permissions
  if (isSuperAdmin(user)) return true;
  
  return !!user.permissions[permissionName as keyof AdminPermissions];
};

/**
 * Get all user permissions
 */
export const getUserPermissions = (user: AdminUser | null): AdminPermissions => {
  if (!user) return {};
  return user.permissions || {};
};

/**
 * Default permission set for new admins
 */
export const defaultPermissionSet: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: false,
  canManageContent: true,
  canManageServices: false,
  canManagePrograms: false,
  canViewAnalytics: true,
  canDeleteContent: false,
  canApproveExperts: false,
  canManageBlog: false,
  canManageTestimonials: false
};
