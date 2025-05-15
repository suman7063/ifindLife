
import React from 'react';

export interface AdminUser {
  id: string;
  username?: string;
  role: 'admin' | 'superadmin';
  permissions: AdminPermissions;
  lastLogin?: string;
  createdAt?: string;
}

export interface AdminPermissions {
  [key: string]: boolean;
  experts?: boolean;
  expertApprovals?: boolean;
  services?: boolean;
  herosection?: boolean;
  testimonials?: boolean;
  blog?: boolean;
  programs?: boolean;
  sessions?: boolean;
  referrals?: boolean;
  contact?: boolean;
  adminUsers?: boolean;
  settings?: boolean;
  analytics?: boolean;
  reports?: boolean;
  users?: boolean;
  content?: boolean;
}

export interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  permissions: AdminPermissions | null;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  isSuperAdmin: boolean;
  addAdmin: (username: string, password: string, permissions?: AdminPermissions) => void;
  removeAdmin: (username: string) => void;
  updateAdminPermissions: (username: string, permissions: AdminPermissions) => void;
  isLoading: boolean;
  updateAdminUser: (username: string, userData: Partial<AdminUser>) => void;
}

export const AdminAuthContext = React.createContext<AdminAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  permissions: null,
  hasPermission: () => false,
  isSuperAdmin: false,
  addAdmin: () => {},
  removeAdmin: () => {},
  updateAdminPermissions: () => {},
  isLoading: true,
  updateAdminUser: () => {}
});
