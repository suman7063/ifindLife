
import React, { ReactNode, createContext, useContext } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { AdminUser } from './types';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

// Create context with default values
export const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  login: async () => false,
  logout: async () => false
});

// Hook to use the admin auth context
export const useAuth = (): AdminAuthContextType => {
  return useContext(AdminAuthContext);
};

// Provider component
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const adminAuth = useAdminAuth();
  
  // Context value
  const value: AdminAuthContextType = {
    isAuthenticated: adminAuth.isAuthenticated,
    isLoading: adminAuth.isLoading,
    currentUser: adminAuth.currentUser,
    login: adminAuth.login,
    logout: adminAuth.logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
