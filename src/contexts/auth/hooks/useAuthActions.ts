
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthState, LoginOptions } from '../types';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';

export const useAuthActions = (authState: AuthState, refreshCallback: () => void) => {
  const [actionLoading, setActionLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, options?: LoginOptions): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Successfully logged in!');
        refreshCallback();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [refreshCallback]);

  const signup = useCallback(async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Account created successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout');
        return false;
      }

      toast.success('Successfully logged out!');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [refreshCallback]);

  const updateProfile = useCallback(async (data: any): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const updated = await UserRepository.update(authState.user.id, data);
      if (updated) {
        toast.success('Profile updated successfully');
        refreshCallback();
        return true;
      }
      
      toast.error('Failed to update profile');
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
      return false;
    }
  }, [authState.user, refreshCallback]);

  const updateExpertProfile = useCallback(async (data: any): Promise<boolean> => {
    try {
      if (!authState.expertProfile) return false;
      
      const updated = await ExpertRepository.update(authState.expertProfile.id, data);
      if (updated) {
        toast.success('Expert profile updated successfully');
        refreshCallback();
        return true;
      }
      
      toast.error('Failed to update expert profile');
      return false;
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('An error occurred while updating expert profile');
      return false;
    }
  }, [authState.expertProfile, refreshCallback]);

  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Password update error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('An unexpected error occurred');
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
    updateExpertProfile,
    updatePassword,
    refreshProfile,
    actionLoading
  };
};
