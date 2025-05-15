
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
  hasPermission: () => false,
  getAdminById: () => null,
  updateAdminRole: () => false,
  error: null,
  permissions: {}
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
  
  // Permissions handling
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return isSuperAdmin || !!currentUser.permissions[permission];
  };
  
  // Get admin by ID
  const getAdminById = (id: string) => {
    return adminUsers.find(admin => admin.id === id) || null;
  };
  
  // Update admin role
  const updateAdminRole = (id: string, role: string): boolean => {
    if (!isSuperAdmin) return false;
    // Implementation would go here
    return true;
  };

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
        updateAdminUser,
        hasPermission,
        getAdminById,
        updateAdminRole,
        error: null,
        permissions: currentUser?.permissions || {}
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
