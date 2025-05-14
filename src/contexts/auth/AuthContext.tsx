
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthState, initialAuthState, UserRole, AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => false,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateProfile: async () => false,
  clearSession: () => {},
  updatePassword: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  rechargeWallet: async () => false,
  addReview: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => null,
  updateProfilePicture: async () => null,
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
    clearSession,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    updateProfilePicture
  } = useAuthFunctions(authState, setAuthState);
  
  // Create function aliases for backward compatibility
  const login = signIn;
  const signup = signUp;
  const logout = signOut;
  
  // Combine state and functions into context value
  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    signUp,
    login,
    logout,
    signup,
    updateProfile,
    clearSession,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    updateProfilePicture,
    user: authState.user,
    userProfile: authState.profile,
    sessionType: authState.sessionType,
    expertProfile: authState.expertProfile
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
