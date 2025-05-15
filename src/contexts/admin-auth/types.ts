
import { Session } from '@supabase/supabase-js';

export type AdminRole = 'admin' | 'super_admin' | 'content_editor' | 'support';

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
  email: string;
  role: AdminRole;
  username?: string;
  permissions?: AdminPermissions;
  lastLogin?: string;
  createdAt?: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AdminAuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

export interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkRole: (requiredRole: AdminRole | AdminRole[]) => boolean;
  
  // Legacy properties for backward compatibility
  currentUser: AdminUser | null;
  isSuperAdmin: boolean;
  adminUsers: AdminUser[];
  addAdmin: (username: string, role: string) => boolean;
  removeAdmin: (userId: string) => boolean;
  updateAdminPermissions: (userId: string, permissions: AdminPermissions) => void;
  hasPermission: (permission: string) => boolean;
  getAdminById: (userId: string) => AdminUser | null;
  updateAdminRole: (userId: string, role: string) => boolean;
  permissions: AdminPermissions;
  isLoading?: boolean;
}
