
import React, { createContext, useContext } from 'react';
import { useAdminSession } from './useAdminSession';
import { useAdminAuth } from './useAdminAuth';
import { AuthContextType } from './types';
import { initialAuthContext } from './constants';

// Create the context with the initial value
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated, 
    setIsAuthenticated, 
    adminUsers, 
    setAdminUsers, 
    currentUser, 
    setCurrentUser 
  } = useAdminSession();
  
  const { login, logout, addAdmin, removeAdmin } = useAdminAuth({
    adminUsers,
    setAdminUsers,
    setIsAuthenticated,
    setCurrentUser,
    currentUser
  });
  
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      login,
      logout,
      adminUsers,
      addAdmin,
      removeAdmin,
      isSuperAdmin,
      currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
