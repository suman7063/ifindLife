
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState } from './types';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { useAuthActions } from './hooks/useAuthActions';
import { useAuthState } from './hooks/useAuthState';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState } = useAuthState();
  const { login, signup, logout } = useAuthActions(setAuthState);
  const { toTypeB } = useProfileTypeAdapter();
  const { updatePassword } = useAuthFunctions();

  // Function to update user profile
  const updateProfile = async (updates: any) => {
    if (!authState.user) return false;
    
    try {
      // Convert string[] to number[] for favorite_programs if needed for DB compatibility
      let updatesToUse = { ...updates };
      
      if (updates.favorite_programs && Array.isArray(updates.favorite_programs)) {
        const favoritePrograms = updates.favorite_programs.map((id: string | number) => {
          if (typeof id === 'string') {
            const numId = Number(id);
            return isNaN(numId) ? 0 : numId;
          }
          return id;
        });
        
        updatesToUse.favorite_programs = favoritePrograms;
      }
      
      const { error } = await supabase
        .from('users')
        .update(updatesToUse)
        .eq('id', authState.user.id);
        
      if (error) throw error;
      
      // Update local state with the new profile data
      if (authState.profile) {
        const updatedProfile = { ...authState.profile, ...updates };
        
        setAuthState(prev => ({
          ...prev,
          profile: updatedProfile,
          userProfile: updatedProfile,
          walletBalance: updatedProfile.wallet_balance || 0
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Function to clear the session
  const clearSession = () => {
    setAuthState(initialAuthState);
  };

  // Create the auth context value with proper types
  const contextValue = {
    ...authState,
    login,
    signIn: login,
    signup,
    signUp: signup,
    logout,
    signOut: logout,
    updateProfile,
    updatePassword,
    clearSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
