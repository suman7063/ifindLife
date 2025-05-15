
import React, { createContext, useContext } from 'react';
import { AdminUser, AdminAuthContextType } from './types';
import { useAdminAuth } from './useAdminAuth';
import { useAdminSession } from './useAdminSession';

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  addAdmin: () => false,
  removeAdmin: () => false,
  isSuperAdmin: false,
  currentUser: null,
  updateAdminPermissions: () => false,
  isLoading: true,
  updateAdminUser: () => false,
});

// Admin auth provider component
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the session hook to get and set authentication state
  const {
    isAuthenticated, 
    setIsAuthenticated,
    adminUsers, 
    setAdminUsers,
    currentUser, 
    setCurrentUser,
    isLoading
  } = useAdminSession();

  // Use the auth hooks for login, logout, etc.
  const {
    login,
    logout,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminUser
  } = useAdminAuth({
    adminUsers,
    setAdminUsers,
    setIsAuthenticated,
    setCurrentUser,
    currentUser
  });

  // Check if current user is a super admin
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        adminUsers,
        addAdmin,
        removeAdmin,
        isSuperAdmin,
        currentUser,
        updateAdminPermissions,
        isLoading,
        updateAdminUser
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};
