
export interface AdminPermissions {
  [key: string]: boolean;
}

export const defaultPermissions: AdminPermissions = {
  experts: true,
  expertApprovals: false,
  services: true,
  herosection: true,
  testimonials: true,
  blog: true,
  programs: true,
  sessions: true,
  referrals: false,
  contact: true,
  settings: false,
};

export const superAdminPermissions: AdminPermissions = {
  experts: true,
  expertApprovals: true,
  services: true,
  herosection: true,
  testimonials: true,
  blog: true,
  programs: true,
  sessions: true,
  referrals: true,
  contact: true,
  settings: true,
};

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  username: string;
  password: string;
  role: AdminRole;
  permissions: AdminPermissions;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, password: string, permissions?: AdminPermissions) => void;
  removeAdmin: (username: string) => void;
  isSuperAdmin: boolean;
  currentUser: AdminUser | null;
  updateAdminPermissions: (username: string, permissions: AdminPermissions) => void;
  isLoading: boolean;
}
