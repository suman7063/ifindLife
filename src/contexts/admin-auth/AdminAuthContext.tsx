
import React, { createContext, useContext } from 'react';
import { AdminUser, AdminAuthContextType, AdminPermissions } from './types';

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  isLoading: true,
  hasPermission: () => false,
  isSuperAdmin: () => false,
  logout: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export { AdminAuthContext };
