
import { AdminUser, defaultPermissions, superAdminPermissions } from "./types";

export const defaultAdminUsers: AdminUser[] = [
  {
    username: 'admin',
    password: 'adminpass',
    role: 'superadmin',
    permissions: superAdminPermissions
  },
  {
    username: 'editor',
    password: 'editorpass',
    role: 'admin',
    permissions: defaultPermissions
  }
];

export const initialAuthContext = {
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  adminUsers: defaultAdminUsers,
  addAdmin: () => {},
  removeAdmin: () => {},
  isSuperAdmin: false,
  currentUser: null,
  updateAdminPermissions: () => {}
};
