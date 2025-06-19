
import { Session } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  permissions: AdminPermissions;
  lastLogin?: string;
  createdAt?: string;
}

export type AdminRole = 'admin' | 'superadmin';

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
}

export interface AdminAuthContextType {
  // User and session state
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Role checking
  checkRole: (role: AdminRole) => boolean;
  
  // Legacy properties (for backward compatibility)
  currentUser: AdminUser | null;
  isSuperAdmin: (user: AdminUser | null) => boolean;
  adminUsers: AdminUser[];
  permissions: AdminPermissions;
  isLoading: boolean;
  
  // Admin user management
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  removeAdmin: (adminId: string) => void;
  updateAdminPermissions: (adminId: string, permissions: Partial<AdminPermissions>) => void;
  hasPermission: (user: AdminUser | null, permission: keyof AdminPermissions) => boolean;
  getAdminById: (id: string) => AdminUser | undefined;
  updateAdminRole: (adminId: string, role: AdminRole) => void;
}
