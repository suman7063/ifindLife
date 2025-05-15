
import { AdminPermissions, AdminUser } from './AdminAuthContext';

// Export the types that are needed
export type { AdminPermissions, AdminUser };

// Define default permissions object
export const defaultPermissions: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: true,
  canManagePrograms: true,
  canManageContent: true,
  canViewReports: true,
  canModerate: false
};

// Define permissions for super admin role
export const superAdminPermissions: AdminPermissions = {
  canManageUsers: true,
  canManageExperts: true,
  canManagePrograms: true,
  canManageContent: true,
  canViewReports: true,
  canModerate: true
};

// Define the authentication context type
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, password?: string, permissions?: AdminPermissions) => void;
  removeAdmin: (username: string) => void;
  isSuperAdmin: boolean;
  currentUser: AdminUser | null;
  updateAdminPermissions: (username: string, permissions: AdminPermissions) => void;
  isLoading: boolean;
  updateAdminUser: (username: string, updates: Partial<AdminUser>) => void;
}
