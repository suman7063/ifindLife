
import { AdminRole, AdminUser, AdminPermissions } from '../types';

export const usePermissions = (user: AdminUser | null) => {
  // Check if user has required role
  const checkRole = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Compute isSuperAdmin based on user role
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';

  // Create additional mock functions for backward compatibility
  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    return !!user.permissions[permission as keyof AdminPermissions];
  };
  
  const getAdminById = (_userId: string) => null;
  const updateAdminRole = (_userId: string, _role: string) => true;
  const addAdmin = (_username: string, _role: string) => true;
  const removeAdmin = (_userId: string) => true;
  const updateAdminPermissions = (_userId: string, _permissions: AdminPermissions) => {};

  return {
    checkRole,
    isSuperAdmin,
    hasPermission,
    getAdminById,
    updateAdminRole,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
  };
};
