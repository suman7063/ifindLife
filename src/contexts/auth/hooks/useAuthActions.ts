
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '@/contexts/auth/types';
import { UserProfile } from '@/types/database/unified';
import { userRepository } from '@/repositories';

export const useAuthActions = (state: AuthState, setState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const refreshProfile = useCallback(async () => {
    if (!state.user?.id) return;

    try {
      const profile = await userRepository.getUser(state.user.id);
      
      if (profile) {
        setState(prev => ({
          ...prev,
          profile,
          userProfile: profile,
          isAuthenticated: true,
          walletBalance: profile.wallet_balance || 0
        }));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user?.id, setState]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return !!data.session;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  }, [setState]);

  const signup = useCallback(async (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true, error: null }));

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // The user row should be created automatically by our database trigger
      // Check if the user profile exists
      const userProfile = await userRepository.getUser(authData.user.id);
      
      if (!userProfile) {
        // If for some reason the trigger didn't work, create the profile manually
        const profileData: Partial<UserProfile> = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          country: userData.country,
          city: userData.city,
          currency: userData.currency || 'USD',
          wallet_balance: 0
        };

        // Insert the profile manually
        const { error: profileError } = await supabase
          .from('users')
          .insert([profileData]);

        if (profileError) throw profileError;
      }

      // Handle referral if a code was provided
      if (referralCode) {
        const { data: referrerData, error: referrerError } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (!referrerError && referrerData) {
          // Create a referral record
          await supabase.from('referrals').insert([{
            referrer_id: referrerData.id,
            referred_id: authData.user.id,
            referral_code: referralCode,
            status: 'pending'
          }]);

          // Update the user's referred_by field
          await supabase
            .from('users')
            .update({ referred_by: referrerData.id })
            .eq('id', authData.user.id);
        }
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  }, [setState]);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setState({
        ...initialAuthState,
        loading: false,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      return false;
    }
  }, [setState]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!state.user?.id) return false;
    
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // First check if the profile exists
      const profile = await userRepository.getUser(state.user!.id);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Use repository to update user profile
      const success = await userRepository.updateUser(state.user.id, updates);
      
      if (!success) {
        throw new Error('Failed to update profile');
      }

      // Refresh profile data
      await refreshProfile();
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  }, [state.user?.id, setState, refreshProfile]);

  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  }, [setState]);

  return {
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile
  };
};
