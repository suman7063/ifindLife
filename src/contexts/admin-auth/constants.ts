
import { AdminUser } from './AdminAuthContext';
import { defaultPermissions, superAdminPermissions } from './types';

// Define default admin users for development
export const defaultAdminUsers: Omit<AdminUser, 'id'>[] = [
  {
    username: 'admin',
    role: 'admin',
    permissions: defaultPermissions,
    createdAt: new Date().toISOString(),
  },
  {
    username: 'IFLsuperadmin',
    role: 'superadmin',
    permissions: superAdminPermissions,
    createdAt: new Date().toISOString(),
  }
];
