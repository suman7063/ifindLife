
import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
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
import { AuthState, UserProfile, UserRole, ExpertProfile, AuthStatus } from './types';

// Define AuthContextType interface
export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  profile: UserProfile | null;
  role: UserRole;
  expertProfile: ExpertProfile | null;
  walletBalance: number;
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  loginWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<{ error: Error | null }>;
  getUserDisplayName: () => string;
  fetchProfile: () => Promise<UserProfile | null>;
  addFunds: (amount: number) => Promise<{ error: Error | null }>;
  updateWalletBalance: (newBalance: number) => Promise<{ error: Error | null }>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<{ error: Error | null }>;
  fetchExpertProfile: () => Promise<ExpertProfile | null>;
  registerAsExpert: (data: any) => Promise<{ error: Error | null }>;
}

// Default state values
const initialAuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  session: null,
  authStatus: 'loading' as const,
  profile: null,
  role: null,
  expertProfile: null,
  walletBalance: 0,
};

// Context creation
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: async () => false,
  loginWithOtp: async () => ({ error: null }),
  signup: async () => false,
  logout: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => false,
  updatePassword: async () => false,
  updateEmail: async () => ({ error: null }),
  refreshSession: async () => ({ error: null }),
  getUserDisplayName: () => '',
  fetchProfile: async () => null,
  addFunds: async () => ({ error: null }),
  updateWalletBalance: async () => ({ error: null }),
  updateExpertProfile: async () => ({ error: null }),
  fetchExpertProfile: async () => null,
  registerAsExpert: async () => ({ error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state from hook
  const {
    authState,
    setAuthState
  } = useAuthState();
  
  // Extract state properties
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
  } = authState;
  
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

// Export the hook for easy use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
