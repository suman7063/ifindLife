
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
  lastLogin?: string; // Add missing property
}

export const initialAdminAuthState = {
  isAuthenticated: false,
  isLoading: true,
  currentUser: null as AdminUser | null,
  error: null as Error | null,
  adminUsers: [] as AdminUser[],
  isSuperAdmin: false,
  permissions: {} as AdminPermissions
};

export type AdminAuthState = typeof initialAdminAuthState;

export interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Additional properties for compatibility
  addAdmin: (username: string, role: string) => boolean;
  removeAdmin: (id: string) => boolean;
  updateAdminPermissions: (userId: string, permissions: Partial<AdminPermissions>) => boolean;
  hasPermission: (permission: string) => boolean;
  getAdminById: (id: string) => AdminUser | null;
  updateAdminRole: (id: string, role: string) => boolean;
}

// Export default permissions
export const defaultPermissions: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: false,
  canManageContent: false,
  canManageServices: false,
  canManagePrograms: false,
  canViewAnalytics: false,
  canDeleteContent: false,
  canApproveExperts: false,
  canManageBlog: false,
  canManageTestimonials: false
};

