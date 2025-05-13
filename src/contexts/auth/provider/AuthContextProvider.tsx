
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, UserProfile, UserRole, ExpertProfile, AuthStatus, AuthContextType, initialAuthState } from '../types';
import { AuthContext } from '../AuthContext';

// Import hooks
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';
import { useProfileFunctions } from '../hooks/useProfileFunctions';
import { useExpertInteractions } from '../hooks/useExpertInteractions';
import { useAuthMethods } from '../hooks/useAuthMethods';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state from hook
  const {
    authState,
    fetchUserData
  } = useAuthState();
  
  // Extract state properties
  const {
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    userProfile,
    profile,
    role,
    expertProfile,
    walletBalance,
    sessionType
  } = authState;
  
  // Create a wrapper function for fetchUserData
  const wrappedFetchUserData = async (): Promise<void> => {
    if (user?.id) {
      return fetchUserData(user.id);
    }
    return fetchUserData();
  };
  
  // Auth actions
  const { 
    login,
    signup,
    logout,
    actionLoading
  } = useAuthActions(wrappedFetchUserData);
  
  // Profile functions
  const {
    updateProfile: updateProfileFn,
    getUserDisplayName,
    fetchProfile: fetchProfileFn,
    addFunds,
    updateWalletBalance
  } = useProfileFunctions(user, session, userProfile, role);
  
  // Expert interactions
  const {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  } = useExpertInteractions(profile?.id);

  // Additional auth methods
  const {
    loginWithOtp,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
    addToFavorites,
    removeFromFavorites,
  } = useAuthMethods(user);

  // Wrapper functions for type compatibility
  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return fetchProfileFn();
  };
  
  // Wrapper for signup
  const wrappedSignup = async (
    email: string, 
    password: string, 
    userData?: Partial<UserProfile>, 
    referralCode?: string
  ): Promise<boolean> => {
    try {
      // Convert parameters to the format expected by the original signup function
      const signupData = {
        email,
        password,
        name: userData?.name || email.split('@')[0],
        phone: userData?.phone || '',
        country: userData?.country || '',
        city: userData?.city || '',
        referralCode: referralCode || ''
      };
      
      // Call the original signup function
      return await signup(signupData);
    } catch (error) {
      console.error('Error in wrapped signup:', error);
      return false;
    }
  };
  
  // Wrapper for logout
  const wrappedLogout = async (): Promise<{ error: Error | null }> => {
    try {
      const success = await logout();
      return { error: success ? null : new Error('Logout failed') };
    } catch (error: any) {
      return { error };
    }
  };
  
  // Wrapper for updateProfile
  const wrappedUpdateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { error } = await updateProfileFn(updates);
      return !error;
    } catch (error) {
      console.error('Error in wrapped updateProfile:', error);
      return false;
    }
  };
  
  // Alias methods for backward compatibility
  const rechargeWallet = async (amount: number) => {
    const { error } = await addFunds(amount);
    return !error;
  };
  
  // Combined context value with EXPLICIT login method included
  const contextValue: AuthContextType = {
    // Auth state
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    profile,
    userProfile: profile, // Alias for backward compatibility
    role,
    expertProfile,
    walletBalance,
    sessionType,
    
    // Auth methods - CRUCIAL: include the login method explicitly
    login: login,
    loginWithOtp,
    signup: wrappedSignup,
    logout: wrappedLogout,
    resetPassword,
    updateProfile: wrappedUpdateProfile,
    updateUserProfile: wrappedUpdateProfile, // Alias for backward compatibility
    updatePassword,
    updateEmail,
    refreshSession,
    
    // Profile methods
    getUserDisplayName,
    fetchProfile,
    addFunds,
    updateWalletBalance,
    rechargeWallet,
    
    // Expert methods
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
    
    // User actions
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    
    // Favorites
    addToFavorites,
    removeFromFavorites
  };
  
  // Debug output to verify login function
  console.log('AuthContextProvider: Login function available?', !!contextValue.login);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
