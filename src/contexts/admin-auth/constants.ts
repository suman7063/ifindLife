
import { AdminUser, AdminPermissions } from './types';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "1",
    username: "IFLsuperadmin",
    role: "superadmin",
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: true,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    },
    lastLogin: new Date().toISOString()
  },
  {
    id: "2",
    username: "admin",
    role: "admin",
    permissions: {
      canManageUsers: false,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: false,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: false,
      canApproveExperts: false,
      canManageBlog: true,
      canManageTestimonials: true
    },
    lastLogin: new Date().toISOString()
  }
];
