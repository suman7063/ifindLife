
import React, { createContext, useContext } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { useProfileFunctions } from './hooks/useProfileFunctions';
import { useExpertInteractions } from './hooks/useExpertInteractions';
import { AuthContextType, initialAuthState, UserRole } from './types';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState, checkUserRole, fetchUserData } = useAuthState();
  
  const { 
    login,
    signup,
    expertLogin,
    expertSignup,
    logout
  } = useAuthFunctions(authState, setAuthState, fetchUserData);
  
  const {
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword
  } = useProfileFunctions(authState, setAuthState);
  
  const userId = authState.user?.id || null;
  const expertInteractions = useExpertInteractions(userId);
  
  // Combine all functions and state into context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    expertLogin,
    expertSignup,
    logout,
    checkUserRole,
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword,
    ...expertInteractions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export types for consumers
export type { UserRole, AuthContextType };
