
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AdminUser, AdminPermissions, AuthContextType, defaultPermissions, superAdminPermissions } from './types';
import { defaultAdminUsers } from './constants';
import { useAdminAuth } from './useAdminAuth';
import { useAdminSession } from './useAdminSession';

// Create context with default values
const AdminAuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  addAdmin: () => {},
  removeAdmin: () => {},
  isSuperAdmin: false,
  currentUser: null,
  updateAdminPermissions: () => {},
  isLoading: true,
  updateAdminUser: () => {},
});

// Initial admin users are now only fetched from constants to avoid duplication
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isAuthenticated, 
    setIsAuthenticated,
    adminUsers, 
    setAdminUsers,
    currentUser, 
    setCurrentUser
  } = useAdminSession();
  const [isLoading, setIsLoading] = useState(true);

  // Use the authentication hooks
  const {
    login,
    logout,
    loginError,
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

  // Initialize data
  useEffect(() => {
    // Initialize admin users from localStorage or use defaults
    const storedAdminUsers = localStorage.getItem('admin-users');
    if (storedAdminUsers) {
      try {
        const parsedAdminUsers = JSON.parse(storedAdminUsers);
        setAdminUsers(parsedAdminUsers);
        console.log('Loaded admin users from localStorage:', parsedAdminUsers.length);
      } catch (error) {
        console.error('Error parsing stored admin users:', error);
        localStorage.removeItem('admin-users');
        setAdminUsers(defaultAdminUsers);
        // Save default admin users to localStorage
        localStorage.setItem('admin-users', JSON.stringify(defaultAdminUsers));
      }
    } else {
      console.log('No stored admin users found, using defaults');
      // Save default admin users to localStorage
      localStorage.setItem('admin-users', JSON.stringify(defaultAdminUsers));
    }
    
    setIsLoading(false);
  }, []);

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
