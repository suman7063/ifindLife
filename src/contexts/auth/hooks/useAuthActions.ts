
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, UpdateProfileParams } from '../types';

export const useAuthActions = (authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  // Sign in user
  const signIn = useCallback(async (email: string, password: string, loginAs?: 'user' | 'expert') => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }, []);
  
  // Sign up user
  const signUp = useCallback(async (email: string, password: string, userData?: any, referralCode?: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            ...userData,
            referral_code: referralCode
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  }, []);
  
  // Sign out user
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        return false;
      }
      
      // Reset auth state
      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        profile: null,
        userProfile: null,
        expertProfile: null,
        isAuthenticated: false,
        role: null,
        sessionType: 'none',
        walletBalance: 0
      }));
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }, [setAuthState]);
  
  // Update user profile
  const updateProfile = useCallback(async (updates: UpdateProfileParams) => {
    try {
      if (!authState.user?.id) {
        console.error('Update profile error: No user ID');
        return false;
      }
      
      // Update the user profile in the database
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Update profile error:', error.message);
        return false;
      }
      
      // Update the auth state
      setAuthState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
        userProfile: prev.profile ? { ...prev.profile, ...updates } : null,
        walletBalance: updates.wallet_balance !== undefined ? updates.wallet_balance : prev.walletBalance
      }));
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Clear session
  const clearSession = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      user: null,
      session: null,
      profile: null,
      userProfile: null,
      expertProfile: null,
      isAuthenticated: false,
      role: null,
      sessionType: 'none',
      walletBalance: 0
    }));
  }, [setAuthState]);
  
  // Create aliases for backward compatibility
  const login = signIn;
  const signup = signUp;
  const logout = signOut;
  
  return {
    signIn,
    signUp,
    signOut,
    login,
    signup,
    logout,
    updateProfile,
    clearSession
  };
};
