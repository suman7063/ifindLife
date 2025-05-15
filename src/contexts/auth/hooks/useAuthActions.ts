
import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { supabase } from '@/lib/supabase';
import { userRepository, expertRepository } from '@/repositories';
import { AuthState, SessionType } from '../types';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useAuthActions = (
  state: AuthState,
  setState: Dispatch<SetStateAction<AuthState>>
) => {
  // Login functionality
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Attempt login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(error.message)
        }));
        return false;
      }
      
      if (!data.session || !data.user) {
        const errorMsg = 'Login failed: No session or user data returned';
        console.error(errorMsg);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(errorMsg)
        }));
        return false;
      }
      
      // Session and user details will be set by the auth state listener
      setState(prev => ({
        ...prev,
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          role: data.user.app_metadata?.role || 'user'
        },
        loading: false,
        isLoading: false
      }));
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error(error.message || 'An error occurred during login');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  // Signup functionality
  const signup = async (
    email: string, 
    password: string, 
    userData?: any, 
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Add referral code to metadata if provided
      const metadata = {
        ...userData
      };
      
      if (referralCode) {
        metadata.referred_by = referralCode;
      }
      
      // Attempt signup with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(error.message)
        }));
        return false;
      }
      
      // If email verification is required
      if (!data.session) {
        toast.success('Registration successful! Please check your email for verification.');
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false
        }));
        return true;
      }
      
      toast.success('Registration successful!');
      
      // User session will be handled by the auth state listener
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error.message);
      toast.error(error.message || 'An error occurred during signup');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  // Logout functionality
  const logout = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Clear any stored login origin
      sessionStorage.removeItem('loginOrigin');
      
      // Sign out with Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error(error.message);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(error.message)
        }));
        return false;
      }
      
      // Reset state to initial values
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        profile: null,
        userProfile: null,
        expertProfile: null,
        isAuthenticated: false,
        sessionType: 'none' as SessionType,
        role: null,
        loading: false,
        isLoading: false
      }));
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast.error(error.message || 'An error occurred during logout');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  // Update profile functionality
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Ensure user is authenticated
      if (!state.user) {
        console.error('Cannot update profile: No authenticated user');
        toast.error('You must be logged in to update your profile');
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error('No authenticated user')
        }));
        return false;
      }
      
      // Update profile using repository
      const success = await userRepository.updateUser(state.user.id, updates);
      
      if (!success) {
        console.error('Failed to update profile');
        toast.error('Failed to update profile');
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error('Failed to update profile')
        }));
        return false;
      }
      
      // Refresh profile data
      await refreshProfile();
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      toast.error(error.message || 'An error occurred while updating profile');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  // Update password functionality
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        console.error('Update password error:', error.message);
        toast.error(error.message);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(error.message)
        }));
        return false;
      }
      
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
      toast.success('Password updated successfully');
      
      return true;
    } catch (error: any) {
      console.error('Update password error:', error.message);
      toast.error(error.message || 'An error occurred while updating password');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  // Refresh profile functionality
  const refreshProfile = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Ensure user is authenticated
      if (!state.user) {
        setState(prev => ({ ...prev, loading: false, isLoading: false }));
        return;
      }
      
      // Fetch both user and expert profiles
      const [userProfile, expertProfile] = await Promise.all([
        userRepository.getUser(state.user.id),
        expertRepository.getExpertByAuthId(state.user.id)
      ]);
      
      // Determine session type based on profiles
      let sessionType: SessionType = 'none';
      if (userProfile && expertProfile) sessionType = 'dual';
      else if (userProfile) sessionType = 'user';
      else if (expertProfile) sessionType = 'expert';
      
      // Determine role based on profiles
      let role = state.user.role;
      if (expertProfile && !userProfile) role = 'expert';
      else if (userProfile && !expertProfile) role = 'user';
      
      // Update state with fetched data
      setState(prev => ({
        ...prev,
        profile: userProfile, // For backward compatibility
        userProfile,
        expertProfile,
        isAuthenticated: !!(userProfile || expertProfile),
        sessionType,
        role,
        walletBalance: userProfile?.wallet_balance || 0,
        loading: false,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Refresh profile error:', error.message);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
    }
  };

  const registerExpert = async (email: string, password: string, expertData: any): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Check if there's an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        setState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...expertData,
            user_type: 'expert' // Mark this as an expert account
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        toast.error(authError.message);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(authError.message)
        }));
        return false;
      }
      
      if (!authData.session || !authData.user) {
        const errorMsg = 'Registration failed. No session or user created.';
        toast.error(errorMsg);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(errorMsg)
        }));
        return false;
      }
      
      // Format data for expert profile
      const expertExperience = typeof expertData.experience === 'number' 
        ? String(expertData.experience) 
        : (expertData.experience || '');

      // Create expert profile
      const expertProfileData = {
        auth_id: authData.user.id,
        name: expertData.name,
        email,
        phone: expertData.phone || '',
        address: expertData.address || '',
        city: expertData.city || '',
        state: expertData.state || '',
        country: expertData.country || '',
        specialization: expertData.specialization || '',
        experience: expertExperience,
        bio: expertData.bio || '',
        certificate_urls: expertData.certificate_urls || [],
        selected_services: expertData.selected_services || [],
        status: 'pending'
      };
      
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertProfileData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        toast.error(profileError.message);
        
        // Sign out the created auth account
        await supabase.auth.signOut();
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          isLoading: false,
          error: new Error(profileError.message)
        }));
        return false;
      }
      
      // Sign out
      await supabase.auth.signOut();
      
      setState(prev => ({ ...prev, loading: false, isLoading: false }));
      toast.success('Expert registration successful! Please log in with your credentials once approved.');
      
      return true;
    } catch (error: any) {
      console.error('Expert registration error:', error.message);
      toast.error(error.message || 'An unexpected error occurred during expert registration');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false,
        error: error as Error
      }));
      return false;
    }
  };
  
  return {
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile,
    registerExpert
  };
};
