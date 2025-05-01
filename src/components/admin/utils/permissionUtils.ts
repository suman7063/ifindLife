
/**
 * Check if user has any permissions
 * @param user Admin user object
 * @returns boolean indicating if the user has any permissions
 */
export const hasAnyPermission = (user: any): boolean => {
  return user && Object.values(user.permissions).some(val => val === true);
};
