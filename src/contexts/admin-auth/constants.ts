
import { AdminUser } from './types';

export const defaultAdminUsers: AdminUser[] = [
  { username: 'Soultribe', role: 'superadmin' }
];

export const initialAuthContext = {
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: defaultAdminUsers,
  addAdmin: () => false,
  removeAdmin: () => false,
  isSuperAdmin: false,
  currentUser: null
};
