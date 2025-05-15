
export interface AdminPermissions {
  canManageUsers: boolean;
  canManageExperts: boolean;
  canManagePrograms: boolean;
  canManageContent: boolean;
  canViewReports: boolean;
  canModerate: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'superadmin';
  permissions: AdminPermissions;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, role: 'admin' | 'superadmin') => boolean;
  removeAdmin: (id: string) => boolean;
  isSuperAdmin: boolean;
  updateAdminPermissions: (userId: string, newPermissions: Partial<AdminPermissions>) => boolean;
  isLoading: boolean;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => boolean;
}
