
import { AdminUser, defaultPermissions, superAdminPermissions } from './types';

export const defaultAdminUsers: AdminUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    permissions: defaultPermissions,
    createdAt: new Date().toISOString(),
  },
  {
    username: 'IFLsuperadmin',
    password: 'Freesoul@99IFL',
    role: 'superadmin',
    permissions: superAdminPermissions,
    createdAt: new Date().toISOString(),
  }
];
