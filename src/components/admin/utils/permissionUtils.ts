
import { AdminPermissions } from '@/contexts/admin-auth/types';

interface AdminUser {
  role?: string;
  permissions?: AdminPermissions | Record<string, boolean>;
}

/**
 * Check if user has any permissions
 * @param user Admin user object
 * @returns boolean indicating if the user has any permissions
 */
export const hasAnyPermission = (user: AdminUser | null): boolean => {
  if (!user || !user.permissions) {
    return false;
  }
  return Object.values(user.permissions).some(val => val === true);
};

/**
 * Check if user has a specific permission
 * @param user Admin user object
 * @param permission Permission to check
 * @returns boolean indicating if the user has the specified permission
 */
export const hasPermission = (user: AdminUser | null, permission: string): boolean => {
  if (!user || !user.permissions) {
    return false;
  }
  
  // Super admins have all permissions
  if (user.role === 'superadmin') {
    return true;
  }
  
  // Convert the permissions object to a Record<string, boolean>
  const permissionsRecord = user.permissions as Record<string, boolean>;
  
  // Check if the permission exists in the user's permissions object
  return !!permissionsRecord[permission];
};

/**
 * Check if the user is a super admin
 * @param user Admin user object
 * @returns boolean indicating if the user is a super admin
 */
export const isSuperAdmin = (user: AdminUser | null): boolean => {
  if (!user) {
    return false;
  }
  return user.role === 'superadmin';
};

/**
 * Get a list of permissions that the user has
 * @param user Admin user object
 * @returns array of permission names that the user has
 */
export const getUserPermissions = (user: AdminUser | null): string[] => {
  if (!user || !user.permissions) {
    return [];
  }
  
  // If user is superadmin, return all permissions
  if (user.role === 'superadmin') {
    return Object.keys(user.permissions);
  }
  
  // Convert the permissions object to a Record<string, boolean>
  const permissionsRecord = user.permissions as Record<string, boolean>;
  
  // Return only the permissions that are set to true
  return Object.entries(permissionsRecord)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
};
