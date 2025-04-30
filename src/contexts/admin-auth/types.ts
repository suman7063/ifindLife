
import { AdminUser } from './constants';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, password: string, permissions: AdminPermissions) => void;
  removeAdmin: (username: string) => void;
  isSuperAdmin: boolean;
  currentUser: AdminUser | null;
  updateAdminPermissions: (username: string, permissions: AdminPermissions) => void;
}

export interface AdminPermissions {
  experts: boolean;
  expertApprovals: boolean;
  services: boolean;
  herosection: boolean;
  testimonials: boolean;
  programs: boolean;
  sessions: boolean;
  referrals: boolean;
  blog: boolean;
  contact: boolean;
  adminUsers: boolean;
  settings: boolean;
}

export interface AdminUser {
  username: string;
  password: string;
  role: string;
  permissions: AdminPermissions;
}

export const defaultPermissions: AdminPermissions = {
  experts: true,
  expertApprovals: true,
  services: true,
  herosection: true,
  testimonials: true,
  programs: true,
  sessions: true,
  referrals: true,
  blog: true,
  contact: true,
  adminUsers: false,
  settings: true
};

export const superAdminPermissions: AdminPermissions = {
  experts: true,
  expertApprovals: true,
  services: true,
  herosection: true,
  testimonials: true,
  programs: true,
  sessions: true,
  referrals: true,
  blog: true,
  contact: true,
  adminUsers: true,
  settings: true
};
