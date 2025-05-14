
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthState, initialAuthState, UserRole, AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  clearSession: () => {}
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the hooks to manage state and functions
  const { authState, setAuthState, fetchUserData } = useAuthState();
  const { 
    signIn, 
    signOut, 
    signUp, 
    updateProfile, 
    updateExpertProfile,
    clearSession
  } = useAuthFunctions(authState, setAuthState);
  
  // Combine state and functions into context value
  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    signUp,
    updateProfile,
    clearSession
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
