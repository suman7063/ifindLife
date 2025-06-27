
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';
import { AuthState, LoginOptions } from '../types';
import { toast } from 'sonner';

export const useAuthActions = (
  authState: AuthState,
  refreshCallback: () => void
) => {
  const login = useCallback(async (
    email: string, 
    password: string, 
    options?: LoginOptions
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session) {
        toast.error(error?.message || 'Login failed');
        return false;
      }

      toast.success('Login successful');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [refreshCallback]);

  const signup = useCallback(async (
    email: string,
    password: string,
    userData: any,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create user profile
        await UserRepository.create({
          id: data.user.id,
          ...userData,
          referred_by: referralCode || ''
        });
      }

      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      return false;
    }
  }, [refreshCallback]);

  const updateProfile = useCallback(async (data: any): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const result = await UserRepository.update(authState.user.id, data);
      if (result) {
        toast.success('Profile updated successfully');
        refreshCallback();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }, [authState.user, refreshCallback]);

  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Failed to update password');
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    refreshCallback();
  }, [refreshCallback]);

  return {
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile
  };
};
