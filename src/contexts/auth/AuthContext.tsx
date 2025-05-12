
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Import hooks
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { useProfileActions } from './hooks/useProfileActions';
import { useAuthSessionEffects } from './hooks/useAuthSessionEffects';
import { useExpertInteractions } from './hooks/useExpertInteractions';

// Import types
import { AuthContextType, AuthStatus, UserProfile, UserRole } from './types';

// Default state values
const initialAuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  session: null,
  authStatus: 'loading' as AuthStatus,
  profile: null,
  role: null,
  expertProfile: null,
  walletBalance: 0,
};

// Context creation
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: async () => ({ error: new Error('Not implemented') }),
  loginWithOtp: async () => ({ error: new Error('Not implemented') }),
  signup: async () => ({ error: new Error('Not implemented') }),
  logout: async () => ({ error: null }),
  resetPassword: async () => ({ error: new Error('Not implemented') }),
  updateProfile: async () => ({ error: new Error('Not implemented') }),
  updatePassword: async () => ({ error: new Error('Not implemented') }),
  updateEmail: async () => ({ error: new Error('Not implemented') }),
  refreshSession: async () => ({ error: new Error('Not implemented') }),
  getUserDisplayName: () => '',
  fetchProfile: async () => null,
  addFunds: async () => ({ error: new Error('Not implemented') }),
  updateWalletBalance: async () => ({ error: new Error('Not implemented') }),
  updateExpertProfile: async () => ({ error: new Error('Not implemented') }),
  fetchExpertProfile: async () => null,
  registerAsExpert: async () => ({ error: new Error('Not implemented') }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State from hooks
  const {
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    profile,
    role,
    expertProfile,
    walletBalance,
  } = useAuthState();
  
  // Initialize auth
  useAuthInitialization();
  
  // Handle session effects
  useAuthSessionEffects();
  
  // Auth actions
  const {
    login,
    loginWithOtp,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
  } = useAuthActions();
  
  // Profile actions
  const {
    updateProfile,
    getUserDisplayName,
    fetchProfile,
    addFunds,
    updateWalletBalance,
  } = useProfileActions();
  
  // Expert interactions
  const {
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
  } = useExpertInteractions();
  
  // Combined context value
  const contextValue = useMemo(() => ({
    // Auth state
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    profile,
    role,
    expertProfile,
    walletBalance,
    
    // Auth methods
    login,
    loginWithOtp,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
    
    // Profile methods
    updateProfile,
    getUserDisplayName,
    fetchProfile,
    addFunds,
    updateWalletBalance,
    
    // Expert methods
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
  }), [
    isLoading, isAuthenticated, user, session, authStatus,
    profile, role, expertProfile, walletBalance,
    login, loginWithOtp, signup, logout, resetPassword,
    updatePassword, updateEmail, refreshSession,
    updateProfile, getUserDisplayName, fetchProfile,
    addFunds, updateWalletBalance,
    updateExpertProfile, fetchExpertProfile, registerAsExpert,
  ]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
