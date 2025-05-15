
import { AdminUser } from './types';

// Mock admin users for development with proper permissions
export const defaultAdminUsers: AdminUser[] = [
  { 
    id: '1', 
    username: 'admin', 
    role: 'admin',
    permissions: {
      canManageUsers: false,
      canManageExperts: true,
      canManagePrograms: true,
      canManageContent: true,
      canViewReports: true,
      canModerate: false
    }
  },
  { 
    id: '2', 
    username: 'superadmin', 
    role: 'superadmin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManagePrograms: true,
      canManageContent: true,
      canViewReports: true,
      canModerate: true
    }
  },
];
