
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { SignupData } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export const useAuthActions = (fetchUserData: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);
  
  // Login function
  const login = useCallback(async (email: string, password: string, preferredRole?: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      console.log(`Login attempt with email: ${email}`);
      
      // Store preferred role in localStorage if provided
      if (preferredRole) {
        console.log(`Setting preferred role: ${preferredRole}`);
        localStorage.setItem('preferredRole', preferredRole);
        sessionStorage.setItem('loginOrigin', preferredRole);
      }
      
      // Login with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Failed to sign in');
        return false;
      }
      
      console.log('Login successful, fetching user data');
      await fetchUserData();
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchUserData]);
  
  // Signup function
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Destructure the data object
      const { email, password, ...userData } = data;
      
      // Sign up with email and password
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Failed to sign up');
        return false;
      }
      
      toast.success('Signup successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);
  
  // Logout function
  const logout = useCallback(async (): Promise<boolean> => {
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message || 'Failed to sign out');
        return false;
      }
      
      // Clear any stored preferences
      localStorage.removeItem('preferredRole');
      sessionStorage.removeItem('loginOrigin');
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);
  
  return {
    login,
    signup,
    logout,
    actionLoading
  };
};
