
import { AdminUser, AdminPermissions } from './types';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "1",
    username: "IFLsuperadmin",
    email: "admin@ifindlove.com",
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
    }
  },
  {
    id: "2",
    username: "admin",
    email: "editor@ifindlove.com",
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
    }
  }
];
