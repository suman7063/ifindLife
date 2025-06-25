
import { useState, useEffect } from 'react';
import { AdminUser, AdminRole, AdminPermissions } from '../types';
import { defaultAdminUsers } from '../constants';

export const usePermissions = (user: AdminUser | null) => {
  const [admins, setAdmins] = useState<AdminUser[]>(defaultAdminUsers);
  
  // Helper to check if user is a super admin
  const isSuperAdmin = (user: AdminUser | null): boolean => {
    if (!user) return false;
    return user.role === 'superadmin' || user.role === 'super_admin';
  };
  
  // Role checker function
  const checkRole = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role) || isSuperAdmin(user);
    }
    
    return user.role === requiredRole || isSuperAdmin(user);
  };
  
  // Permission checker function
  const hasPermission = (user: AdminUser | null, permission: keyof AdminPermissions): boolean => {
    if (!user) return false;
    if (isSuperAdmin(user)) return true;
    return !!user.permissions?.[permission];
  };
  
  // Get admin by ID
  const getAdminById = (id: string): AdminUser | undefined => {
    return admins.find(admin => admin.id === id);
  };
  
  // Add admin
  const addAdmin = (adminData: Omit<AdminUser, "id" | "createdAt">): void => {
    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...adminData
    };
    
    setAdmins(prev => [...prev, newAdmin]);
  };
  
  // Remove admin
  const removeAdmin = (adminId: string): void => {
    setAdmins(prev => prev.filter(admin => admin.id !== adminId));
  };
  
  // Update admin permissions
  const updateAdminPermissions = (adminId: string, permissions: Partial<AdminPermissions>): void => {
    setAdmins(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, permissions: { ...admin.permissions, ...permissions } }
          : admin
      )
    );
  };
  
  // Update admin role
  const updateAdminRole = (adminId: string, role: AdminRole): void => {
    setAdmins(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, role }
          : admin
      )
    );
  };

  return {
    isSuperAdmin,
    checkRole,
    hasPermission,
    getAdminById,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminRole,
  };
};
