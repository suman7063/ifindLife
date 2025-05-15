import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '../types';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/supabase/user';

export const useAuthActions = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  // Define login functionality
  const login = useCallback(async (
    email: string, 
    password: string, 
    loginAs?: 'user' | 'expert'
  ): Promise<boolean> => {
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

      toast({
        title: 'Login successful',
        description: 'Welcome back!'
      });
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define signup functionality
  const signup = useCallback(async (
    email: string, 
    password: string, 
    userData: any = {}, 
    referralCode?: string
  ): Promise<boolean> => {
    try {
      // First, check if the email is already in use
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('email', email);
        
      if (countError) {
        throw new Error(countError.message);
      }
      
      if (count && count > 0) {
        toast({
          title: 'Signup failed',
          description: 'Email is already in use',
          variant: 'destructive'
        });
        return false;
      }
      
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            phone: userData.phone || '',
            country: userData.country || '',
            city: userData.city || ''
          }
        }
      });
      
      if (error || !data.user) {
        throw error || new Error('Signup failed');
      }

      // Create user profile with additional fields
      const newUser: Partial<UserProfile> = {
        id: data.user.id,
        name: userData.name || '',
        email: email,
        phone: userData.phone || '',
        country: userData.country || '',
        city: userData.city || '',
        profile_picture: userData.profile_picture || '',
        currency: userData.currency || 'USD',
        wallet_balance: 0,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        referred_by: null,
        referral_link: `/signup?ref=${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      };
      
      // If referral code was provided, look up the referrer
      if (referralCode) {
        const { data: referrerData } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();
          
        if (referrerData) {
          newUser.referred_by = referrerData.id;
        }
      }
      
      // Insert the new user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert(newUser);
        
      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // Continue anyway since the auth account was created
      }

      toast({
        title: 'Signup successful',
        description: 'Your account has been created successfully'
      });
      return true;
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Define logout functionality
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Reset auth state to initial
      setAuthState(prevState => ({
        ...prevState,
        user: null,
        profile: null,
        userProfile: null,
        expertProfile: null,
        isAuthenticated: false,
        role: null,
        sessionType: 'none',
        walletBalance: 0
      }));
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully'
      });
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Logout failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, [setAuthState]);

  return { login, signup, logout };
};
