
/**
 * Check if user has any permissions
 * @param user Admin user object
 * @returns boolean indicating if the user has any permissions
 */
export const hasAnyPermission = (user: any): boolean => {
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
export const hasPermission = (user: any, permission: string): boolean => {
  if (!user || !user.permissions) {
    return false;
  }
  
  // Super admins have all permissions
  if (user.role === 'superadmin') {
    return true;
  }
  
  return !!user.permissions[permission];
};
