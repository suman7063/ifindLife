
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { LoginOptions, UserRole } from '../types';

export const useAuthActions = (state: any, refreshCallback: () => void) => {
  const login = useCallback(async (email: string, password: string, options?: LoginOptions): Promise<boolean> => {
    console.log('useAuthActions: login called with options:', options);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        
        // Set session type in localStorage for persistence
        const sessionType = options?.asExpert ? 'expert' : 'user';
        localStorage.setItem('sessionType', sessionType);
        
        toast.success('Login successful');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    try {
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
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        toast.success('Account created successfully');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return false;
      }

      // Clear session type from localStorage
      localStorage.removeItem('sessionType');
      console.log('Logout successful');
      return true;
    } catch (error: any) {
      console.error('Logout exception:', error);
      toast.error('Logout failed. Please try again.');
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: any): Promise<boolean> => {
    if (!state.user?.id) {
      toast.error('No user logged in');
      return false;
    }

    try {
      const success = await userRepository.updateUser(state.user.id, updates);
      
      if (success) {
        toast.success('Profile updated successfully');
        refreshCallback();
      } else {
        toast.error('Failed to update profile');
      }
      
      return success;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }, [state.user?.id, refreshCallback]);

  const updateExpertProfile = useCallback(async (updates: any): Promise<boolean> => {
    if (!state.user?.id) {
      toast.error('No user logged in');
      return false;
    }

    try {
      // Get expert profile first to get the expert ID
      const expertProfile = await expertRepository.getExpertByAuthId(state.user.id);
      if (!expertProfile) {
        toast.error('Expert profile not found');
        return false;
      }

      const success = await expertRepository.updateExpert(expertProfile.id, updates);
      
      if (success) {
        toast.success('Expert profile updated successfully');
        refreshCallback();
      } else {
        toast.error('Failed to update expert profile');
      }
      
      return success;
    } catch (error: any) {
      console.error('Update expert profile error:', error);
      toast.error('Failed to update expert profile');
      return false;
    }
  }, [state.user?.id, refreshCallback]);

  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Update password error:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Update password exception:', error);
      toast.error('Failed to update password');
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user?.id) return;
    
    try {
      refreshCallback();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user?.id, refreshCallback]);

  // Default implementations for extended functionality
  const addToFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    console.log('addToFavorites not implemented:', expertId);
    return false;
  }, []);

  const removeFromFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    console.log('removeFromFavorites not implemented:', expertId);
    return false;
  }, []);

  const rechargeWallet = useCallback(async (amount: number): Promise<boolean> => {
    console.log('rechargeWallet not implemented:', amount);
    return false;
  }, []);

  const addReview = useCallback(async (review: any): Promise<boolean> => {
    console.log('addReview not implemented:', review);
    return false;
  }, []);

  const reportExpert = useCallback(async (report: any): Promise<boolean> => {
    console.log('reportExpert not implemented:', report);
    return false;
  }, []);

  const hasTakenServiceFrom = useCallback(async (expertId: string | number): Promise<boolean> => {
    console.log('hasTakenServiceFrom not implemented:', expertId);
    return false;
  }, []);

  const getExpertShareLink = useCallback((expertId: string | number): string => {
    console.log('getExpertShareLink not implemented:', expertId);
    return '';
  }, []);

  const getReferralLink = useCallback((): string | null => {
    console.log('getReferralLink not implemented');
    return null;
  }, []);

  const updateProfilePicture = useCallback(async (file: File): Promise<string | null> => {
    console.log('updateProfilePicture not implemented:', file);
    return null;
  }, []);

  return {
    login,
    signup,
    logout,
    updateProfile,
    updateExpertProfile,
    updatePassword,
    refreshProfile,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    updateProfilePicture
  };
};
