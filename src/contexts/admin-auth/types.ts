
import { Session } from '@supabase/supabase-js';

// Define the role types
export type AdminRole = 'admin' | 'superadmin' | 'super_admin';

// Define the permissions interface
export interface AdminPermissions {
  [key: string]: boolean;
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
}

// Define the admin user interface
export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: AdminRole;
  permissions: AdminPermissions;
  createdAt: string;
  lastLogin: string;
}

// Define the admin context type
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

// Initial state for the admin auth context
export const initialAuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  currentUser: null,
  isSuperAdmin: false,
  adminUsers: [],
  permissions: {}
};
