
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState } from '../types';
import { UserProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useAuthActions = (
  state: AuthState,
  setState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const [actionLoading, setActionLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Success - session and user will be updated by the auth listener
      toast.success('Logged in successfully');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: 'user'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create a profile in our profiles table
        const profileData = {
          id: data.user.id,
          name: userData.name || '',
          email: data.user.email || '',
          phone: userData.phone || '',
          country: userData.country || '',
          city: userData.city || '',
          currency: userData.currency || 'USD',
          // Add referral code if provided
          ...(referralCode ? { referred_by: referralCode } : {})
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Continue anyway, as the auth account was created
        }
        
        toast.success('Account created successfully!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Reset state to initial
      setState(initialAuthState);
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      if (!state.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Update the profile in our database
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', state.user.id);
        
      if (error) throw error;
      
      // Update local state
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...data } : null,
        userProfile: prev.userProfile ? { ...prev.userProfile, ...data } : null
      }));
      
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (!state.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', state.user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setState(prev => ({
          ...prev,
          profile: data as UserProfile,
          userProfile: data as UserProfile
        }));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return {
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile,
    actionLoading
  };
};
