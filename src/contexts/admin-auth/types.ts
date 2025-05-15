
import { User } from '@supabase/supabase-js';

export type AdminPermission = string;
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

export const defaultPermissions: Record<string, AdminPermission[]> = {
  'superadmin': [
    'manage_users',
    'manage_experts',
    'manage_content',
    'manage_services',
    'manage_programs',
    'view_analytics',
    'delete_content',
    'approve_experts',
    'manage_blog',
    'manage_testimonials'
  ],
  'content': ['manage_content', 'manage_blog'],
  'support': ['view_analytics', 'manage_users'],
  'editor': ['manage_content', 'manage_blog', 'manage_testimonials']
};

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  role: string;
  permissions: AdminPermissions;
  name?: string;
  createdAt?: string;
}

export interface AdminAuthState {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface AdminAuthContextType extends AdminAuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, role: 'admin' | 'superadmin') => boolean;
  removeAdmin: (id: string) => boolean;
  isSuperAdmin: boolean;
  updateAdminPermissions: (userId: string, newPermissions: Partial<AdminPermissions>) => boolean;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => boolean;
  hasPermission: (permission: string) => boolean;
  getAdminById: (id: string) => AdminUser | null;
  updateAdminRole: (id: string, role: string) => boolean;
  permissions: AdminPermissions;
}

export const initialAdminAuthState: AdminAuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};
