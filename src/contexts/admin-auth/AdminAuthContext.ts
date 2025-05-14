
import React from 'react';

export interface AdminUser {
  id: string;
  username?: string;
  role: 'admin' | 'superadmin';
}

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageExperts: boolean;
  canManagePrograms: boolean;
  canManageContent: boolean;
  canViewReports: boolean;
  canModerate: boolean;
}

export interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  permissions: AdminPermissions | null;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
}

export const AdminAuthContext = React.createContext<AdminAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  permissions: null,
  hasPermission: () => false,
});
