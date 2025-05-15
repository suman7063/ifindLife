
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { UserProfile, UserRole } from '../types';

// Define proper type for auth functions
export interface AuthFunctions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  checkSession: () => Promise<{
    isAuthenticated: boolean;
    role: UserRole | null;
    profile: UserProfile | null;
  }>;
}

export const useAuthFunctions = (): AuthFunctions => {
  // Define login functionality
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      if (!data.user) {
        toast({
          title: 'Login failed',
          description: 'User not found',
          variant: 'destructive'
        });
        return false;
      }

      console.log('Login successful for:', data.user.email);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        variant: 'default'
      });
      return true;
    } catch (error: any) {
      console.error('Login exception:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define signup functionality
  const signup = useCallback(async (
    email: string, 
    password: string,
    userData: Record<string, any>
  ): Promise<boolean> => {
    try {
      // Check if email already exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: 'Registration failed',
          description: 'Email already in use',
          variant: 'destructive'
        });
        return false;
      }

      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Registration successful',
        description: 'Please check your email for verification',
      });
      return true;
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define logout functionality
  const logout = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    }
  }, []);

  // Define session check functionality
  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      return {
        isAuthenticated: false,
        role: null as UserRole,
        profile: null
      };
    }

    const user = data.session.user;
    
    // Fetch user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Create a normalized profile object with required properties
    const completeProfile = userProfile ? {
      id: userProfile.id,
      name: userProfile.name || '',
      email: userProfile.email || user.email || '',
      phone: userProfile.phone || '',
      city: userProfile.city || '',
      country: userProfile.country || '',
      profile_picture: userProfile.profile_picture || '',
      wallet_balance: userProfile.wallet_balance || 0,
      currency: userProfile.currency || 'USD',
      created_at: userProfile.created_at || new Date().toISOString(),
      referral_code: userProfile.referral_code || '',
      referral_link: userProfile.referral_link || '',
      referred_by: userProfile.referred_by || null,
      favorite_experts: userProfile.favorite_experts || [],
      favorite_programs: userProfile.favorite_programs ? userProfile.favorite_programs.map(String) : [],
      enrolled_courses: userProfile.enrolled_courses || [],
      reviews: userProfile.reviews || [],
      reports: userProfile.reports || [],
      transactions: userProfile.transactions || [],
      referrals: userProfile.referrals || []
    } : null;
      
    // Determine user role based on profile data
    let role: UserRole = 'user';
    
    // Check for admin role in a separate table or based on specific emails
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
      
    if (adminData && adminData.role) {
      role = 'admin';
    }

    return {
      isAuthenticated: true,
      role,
      profile: completeProfile as UserProfile
    };
  }, []);

  // Define profile update functionality
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error('Update profile failed: No authenticated user');
        return false;
      }
      
      const userId = userData.user.id;
      
      // Update the profile in the database
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
      return true;
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define password update functionality
  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Error updating password:', error);
        toast({
          title: 'Password update failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully'
      });
      return true;
    } catch (error: any) {
      console.error('Error in updatePassword:', error);
      toast({
        title: 'Password update failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define email verification functionality
  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      // Implementation depends on your Supabase setup
      // This is a placeholder that would need to be adjusted based on your auth flow
      return true;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  }, []);

  return {
    login,
    signup,
    logout,
    checkSession,
    updateProfile,
    updatePassword,
    verifyEmail
  };
};
