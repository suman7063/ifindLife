
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '@/contexts/auth/types';
import { UserProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useAuthActions = (state: AuthState, setState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const refreshProfile = useCallback(async () => {
    if (!state.user?.id) return;

    try {
      // First check which table has the user's profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', state.user.id)
        .maybeSingle();

      if (!userError && userData) {
        setState(prev => ({
          ...prev,
          profile: userData as UserProfile,
          userProfile: userData as UserProfile,
          walletBalance: userData.wallet_balance || 0
        }));
        return;
      }
      
      // If not found in users, try profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', state.user.id)
        .maybeSingle();
        
      if (!profileError && profileData) {
        setState(prev => ({
          ...prev,
          profile: profileData as UserProfile,
          userProfile: profileData as UserProfile,
          walletBalance: profileData.wallet_balance || 0
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

      // Create a single profile object with the ID
      const profileData = {
        id: authData.user.id,
        ...userData,
        currency: userData.currency || 'USD',
        wallet_balance: 0
      };

      // Insert the profile
      const { error: profileError } = await supabase
        .from('users')
        .insert(profileData);

      if (profileError) throw profileError;

      // Handle referral if a code was provided
      if (referralCode) {
        const { data: referrerData, error: referrerError } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (!referrerError && referrerData) {
          // Create a referral record
          await supabase.from('referrals').insert({
            referrer_id: referrerData.id,
            referred_id: authData.user.id,
            referral_code: referralCode,
            status: 'pending'
          });

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
      
      // Check which table has the user's profile
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', state.user.id)
        .maybeSingle();
      
      // Determine the table to update
      const table = userData ? 'users' : 'profiles';
      
      // Ensure we have an ID in the updates
      const updatesWithId = {
        ...updates,
        id: state.user.id
      };
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updatesWithId)
        .eq('id', state.user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error(`Failed to update profile: ${error.message}`);
        return false;
      }
      
      // Refresh profile data
      await refreshProfile();
      
      toast.success('Profile updated successfully');
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
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      setState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
      toast.error('Failed to update password');
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
