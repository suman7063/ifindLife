
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '../types';
import { userRepository } from '@/repositories/UserRepository';
import { expertRepository } from '@/repositories/ExpertRepository';
import { UserProfile } from '@/types/database/unified';

export const useAuthFunctions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string, loginAs?: 'user' | 'expert'): Promise<void> => {
    try {
      setAuthState(prev => ({
        ...prev,
        loading: true,
        isLoading: true
      }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Set login origin to help determine role after authentication
      if (loginAs) {
        sessionStorage.setItem('loginOrigin', loginAs);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
        isLoading: false
      }));
      throw error;
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string): Promise<void> => {
    try {
      setAuthState(prev => ({
        ...prev,
        loading: true,
        isLoading: true
      }));

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
        throw error;
      }

      // User is created but needs to verify email
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isLoading: false
      }));
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
        isLoading: false
      }));
      throw error;
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({
        ...prev,
        loading: true,
        isLoading: true
      }));

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      setAuthState({
        ...initialAuthState,
        loading: false,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Signout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
        isLoading: false
      }));
      return false;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!authState.user) {
      return false;
    }

    try {
      setAuthState(prev => ({
        ...prev,
        loading: true,
        isLoading: true
      }));

      const success = await userRepository.updateUser(authState.user.id, updates);
      
      if (success) {
        // Update local state with new profile data
        const updatedProfile = await userRepository.getUser(authState.user.id);
        setAuthState(prev => ({
          ...prev,
          profile: updatedProfile,
          userProfile: updatedProfile,
          loading: false,
          isLoading: false
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
        isLoading: false
      }));
      return false;
    }
  };

  /**
   * Update expert profile
   */
  const updateExpertProfile = async (updates: any): Promise<boolean> => {
    if (!authState.user || !authState.expertProfile) {
      return false;
    }

    try {
      setAuthState(prev => ({
        ...prev,
        loading: true,
        isLoading: true
      }));

      const expertId = authState.expertProfile.id;
      const success = await expertRepository.updateExpert(expertId, updates);
      
      if (success) {
        // Update local state with new expert profile data
        const updatedProfile = await expertRepository.getExpertById(expertId);
        setAuthState(prev => ({
          ...prev,
          expertProfile: updatedProfile,
          loading: false,
          isLoading: false
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update expert profile error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
        isLoading: false
      }));
      return false;
    }
  };

  /**
   * Clear the current session without signing out from Supabase
   */
  const clearSession = () => {
    setAuthState({
      ...initialAuthState,
      loading: false,
      isLoading: false
    });
  };

  return {
    signIn,
    signOut,
    signUp,
    updateProfile,
    updateExpertProfile,
    clearSession
  };
};
