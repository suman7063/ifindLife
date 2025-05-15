
import { User } from '@supabase/supabase-js';

export type AdminRole = 'admin' | 'superadmin' | 'content' | 'support' | 'editor';

export interface AdminPermissions {
  canManageUsers?: boolean;
  canManageExperts?: boolean;
  canManageContent?: boolean;
  canManageServices?: boolean;
  canManagePrograms?: boolean;
  canViewAnalytics?: boolean;
  canDeleteContent?: boolean;
  canApproveExperts?: boolean;
  canManageBlog?: boolean;
  canManageTestimonials?: boolean;
  [key: string]: boolean | undefined;
}

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  permissions: AdminPermissions;
  createdAt?: string;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isSuperAdmin: boolean;
  
  // Additional properties for compatibility
  adminUsers: AdminUser[];
  addAdmin: (username: string, role: string) => boolean;
  removeAdmin: (id: string) => boolean;
  updateAdminPermissions: (userId: string, permissions: Partial<AdminPermissions>) => boolean;
  hasPermission: (permission: string) => boolean;
  getAdminById: (id: string) => AdminUser | null;
  updateAdminRole: (id: string, role: string) => boolean;
  permissions: AdminPermissions;
}
