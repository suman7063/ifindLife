
import { createContext } from 'react';
import { AdminAuthContextType, initialAuthState } from './types';

export const AdminAuthContext = createContext<AdminAuthContextType>({
  ...initialAuthState,
  login: async () => false,
  logout: async () => false,
  checkRole: () => false,
  // Legacy properties for backward compatibility
  currentUser: null,
  isSuperAdmin: false,
  adminUsers: [],
  addAdmin: () => false,
  removeAdmin: () => false,
  updateAdminPermissions: () => {},
  hasPermission: () => false,
  getAdminById: () => null,
  updateAdminRole: () => false,
  permissions: {},
  isLoading: true
});
