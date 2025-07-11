
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchUserProfile } from '@/utils/profileFetcher';
import { UserRole } from '@/contexts/auth/types';
import { UserProfile } from '@/types/database/unified';
import { toast } from '@/hooks/use-toast';

// Define proper type for auth functions without excessive nesting
export interface AuthFunctions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<{
    isAuthenticated: boolean;
    role: UserRole;
    profile: UserProfile | null;
  }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
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
    const profile = await fetchUserProfile(user);

    // Create a normalized profile object with required properties
    const normalizedProfile: UserProfile = {
      id: profile?.id || user.id,
      name: profile?.name || '',
      email: profile?.email || user.email || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      country: profile?.country || '',
      currency: profile?.currency || 'USD',
      profile_picture: profile?.profile_picture || '',
      wallet_balance: profile?.wallet_balance || 0,
      created_at: profile?.created_at || new Date().toISOString(),
      referred_by: profile?.referred_by || null,
      referral_code: profile?.referral_code || '',
      referral_link: profile?.referral_link || '',
      date_of_birth: profile?.date_of_birth || null,
      gender: profile?.gender || null,
      occupation: profile?.occupation || null,
      emergency_contact_name: profile?.emergency_contact_name || null,
      emergency_contact_phone: profile?.emergency_contact_phone || null,
      preferences: profile?.preferences || {},
      terms_accepted: profile?.terms_accepted || false,
      privacy_accepted: profile?.privacy_accepted || false,
      marketing_consent: profile?.marketing_consent || false,
      favorite_experts: profile?.favorite_experts || [],
      favorite_programs: profile?.favorite_programs || [],
      enrolled_courses: profile?.enrolled_courses || [],
      reviews: profile?.reviews || [],
      reports: profile?.reports || [],
      transactions: profile?.transactions || [],
      referrals: profile?.referrals || [],
      recent_activities: profile?.recent_activities || [],
      upcoming_appointments: profile?.upcoming_appointments || []
    };
    
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
      profile: normalizedProfile
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
