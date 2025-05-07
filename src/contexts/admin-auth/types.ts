
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
  analytics: true,
  reports: false,
  users: false
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
  analytics: true,
  reports: true,
  users: true
};

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  username: string;
  password: string;
  role: AdminRole;
  permissions: AdminPermissions;
  lastLogin?: string;
  createdAt?: string;
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
  updateAdminUser: (username: string, userData: Partial<AdminUser>) => void;
}
