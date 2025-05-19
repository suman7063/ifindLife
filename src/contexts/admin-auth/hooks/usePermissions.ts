
import { useState, useCallback } from 'react';
import { AdminUser, AdminRole, AdminPermissions } from '../types';
import { defaultAdminUsers } from '../constants';

export const usePermissions = (currentUser: AdminUser | null) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);

  const isSuperAdmin = useCallback((user: AdminUser | null): boolean => {
    if (!user) return false;
    return user.role === 'superadmin' || user.role === 'super_admin';
  }, []);

  const hasPermission = useCallback((user: AdminUser | null, permission: keyof AdminPermissions): boolean => {
    if (!user) return false;
    if (isSuperAdmin(user)) return true;
    return !!user.permissions && !!user.permissions[permission];
  }, [isSuperAdmin]);

  const checkRole = useCallback((role: AdminRole): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin(currentUser)) return true;
    return currentUser.role === role;
  }, [currentUser, isSuperAdmin]);

  const getAdminById = useCallback((id: string): AdminUser | undefined => {
    return adminUsers.find(admin => admin.id === id);
  }, [adminUsers]);

  const addAdmin = useCallback((admin: Omit<AdminUser, 'id' | 'createdAt'>): void => {
    const newAdmin: AdminUser = {
      ...admin,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    setAdminUsers(prev => [...prev, newAdmin]);
  }, []);

  const removeAdmin = useCallback((adminId: string): void => {
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
  }, []);

  const updateAdminPermissions = useCallback((adminId: string, permissions: Partial<AdminPermissions>): void => {
    setAdminUsers(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { 
              ...admin, 
              permissions: { ...admin.permissions, ...permissions } 
            } 
          : admin
      )
    );
  }, []);

  const updateAdminRole = useCallback((adminId: string, role: AdminRole): void => {
    setAdminUsers(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, role } 
          : admin
      )
    );
  }, []);

  return {
    isSuperAdmin,
    hasPermission,
    checkRole,
    getAdminById,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminRole
  };
};
