
import { createContext, useContext } from 'react';

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageExperts: boolean;
  canManagePrograms: boolean;
  canManageContent: boolean;
  canViewReports: boolean;
  canModerate: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'superadmin';
  permissions: AdminPermissions;
}

export interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  permissions: AdminPermissions | null;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  isSuperAdmin: () => boolean;
  addAdmin: (username: string, role: 'admin' | 'superadmin') => boolean;
  removeAdmin: (id: string) => boolean;
  updateAdminPermissions: (userId: string, permissions: Partial<AdminPermissions>) => boolean;
  getAdminById: (id: string) => AdminUser | null;
  updateAdminRole: (id: string, role: 'admin' | 'superadmin') => boolean;
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  permissions: null,
  hasPermission: () => false,
  isSuperAdmin: () => false,
  addAdmin: () => false,
  removeAdmin: () => false,
  updateAdminPermissions: () => false,
  getAdminById: () => null,
  updateAdminRole: () => false
});

export const useAdminAuth = () => useContext(AdminAuthContext);
