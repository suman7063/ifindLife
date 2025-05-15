
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { AuthState } from '../types';
import { toast } from 'sonner';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';

export const useAuthActions = (state: AuthState, onActionComplete: () => void) => {
  const login = useCallback(async (email: string, password: string, asExpert: boolean = false): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (asExpert) {
        localStorage.setItem('sessionType', 'expert');
      } else {
        localStorage.setItem('sessionType', 'user');
      }
      
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create user profile with additional data
        const profileData = {
          ...userData,
          id: data.user.id,
          email,
          referred_by: null,
          referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        };

        // If referral code provided, find referrer and link
        if (referralCode) {
          const { data: referrerData } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode)
            .maybeSingle();

          if (referrerData) {
            profileData.referred_by = referrerData.id;
            
            // Create referral record
            await supabase.from('referrals').insert({
              referrer_id: referrerData.id,
              referred_id: data.user.id,
              referral_code: referralCode,
            });
          }
        }

        const { error: profileError } = await supabase
          .from('users')
          .insert([profileData]);

        if (profileError) {
          toast.error(`Failed to create profile: ${profileError.message}`);
          return false;
        }
      }

      localStorage.setItem('sessionType', 'user');
      toast.success('Account created successfully!');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  const registerExpert = useCallback(async (
    email: string, 
    password: string, 
    expertData: Partial<ExpertProfile>
  ): Promise<boolean> => {
    try {
      // First create the user account with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create expert profile with the auth user id
        const expertProfileData = {
          ...expertData,
          auth_id: data.user.id,
          email,
          status: 'pending',
          verified: false,
        };

        const { error: profileError } = await supabase
          .from('expert_accounts')
          .insert([expertProfileData]);

        if (profileError) {
          console.error('Expert profile creation error:', profileError);
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }
      }

      localStorage.setItem('sessionType', 'expert');
      toast.success('Expert account created successfully! Your profile is pending approval.');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Expert registration error:', error);
      toast.error('Failed to create expert account. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      localStorage.removeItem('sessionType');
      toast.success('Logged out successfully');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  const refreshUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!state.user?.id) return null;
    return await userRepository.getUser(state.user.id);
  }, [state.user?.id]);

  const refreshExpertProfile = useCallback(async (): Promise<ExpertProfile | null> => {
    if (!state.user?.id) return null;
    return await expertRepository.getExpertByAuthId(state.user.id);
  }, [state.user?.id]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user?.id) return;
    
    try {
      const sessionType = localStorage.getItem('sessionType') || 'user';
      
      if (sessionType === 'expert' || sessionType === 'dual') {
        await refreshExpertProfile();
      }
      
      if (sessionType === 'user' || sessionType === 'dual') {
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user?.id, refreshUserProfile, refreshExpertProfile]);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!state.user?.id) return false;
    return await userRepository.updateUser(state.user.id, updates);
  }, [state.user?.id]);

  const updateExpertProfile = useCallback(async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    return await expertRepository.updateExpert(state.expertProfile.id, updates);
  }, [state.expertProfile?.id]);

  // Backwards compatibility
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    return await updateUserProfile(updates);
  }, [updateUserProfile]);

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
      console.error('Password update error:', error);
      toast.error('Failed to update password');
      return false;
    }
  }, []);

  const addExpertService = useCallback(async (serviceId: number, price: number): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    
    try {
      const currentServices = state.expertProfile.selected_services || [];
      if (currentServices.includes(serviceId)) {
        return true; // Already added
      }
      
      const success = await expertRepository.updateExpert(state.expertProfile.id, {
        selected_services: [...currentServices, serviceId]
      });
      
      return success;
    } catch (error) {
      console.error('Error adding expert service:', error);
      return false;
    }
  }, [state.expertProfile]);

  const removeExpertService = useCallback(async (serviceId: number): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    
    try {
      const currentServices = state.expertProfile.selected_services || [];
      const updatedServices = currentServices.filter(id => id !== serviceId);
      
      const success = await expertRepository.updateExpert(state.expertProfile.id, {
        selected_services: updatedServices
      });
      
      return success;
    } catch (error) {
      console.error('Error removing expert service:', error);
      return false;
    }
  }, [state.expertProfile]);

  return {
    login,
    signup,
    registerExpert,
    logout,
    refreshUserProfile,
    refreshExpertProfile,
    refreshProfile,
    updateUserProfile,
    updateExpertProfile,
    updateProfile,
    updatePassword,
    addExpertService,
    removeExpertService
  };
};
