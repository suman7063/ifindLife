
import { Session } from '@supabase/supabase-js';

// Define the role types for admins
export type AdminRole = 'admin' | 'super_admin';

// Define the permissions interface for admin users
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

// Define the admin user interface
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermissions;
  createdAt: string;
}

// Define the authentication context type
export interface AdminAuthContextType {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
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
  isLoading: boolean;
}

// Initial auth state
export const initialAuthState = {
  isAuthenticated: false,
  isLoading: true,
  error: null,
  user: null,
  session: null
};
