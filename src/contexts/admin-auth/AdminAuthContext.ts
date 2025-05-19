
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { AdminUser, AdminRole, AdminPermissions } from './types';

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

// Create the context with a default value
export const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => false,
  checkRole: () => false,
  
  // Legacy properties
  currentUser: null,
  isSuperAdmin: () => false,
  adminUsers: [],
  permissions: {},
  isLoading: true,
  
  // Admin user management
  addAdmin: () => {},
  removeAdmin: () => {},
  updateAdminPermissions: () => {},
  hasPermission: () => false,
  getAdminById: () => undefined,
  updateAdminRole: () => {}
});
