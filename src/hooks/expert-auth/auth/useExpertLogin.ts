
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '../types';
import { useState } from 'react';

/**
 * Hook for handling expert login functionality
 */
export const useExpertLogin = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const [loginInProgress, setLoginInProgress] = useState(false);

  /**
   * Checks if a user profile exists for the current session
   */
  const checkUserProfile = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      return !!data && !error;
    } catch (error) {
      console.error('Error checking user profile:', error);
      return false;
    }
  };

  /**
   * Checks if an expert profile exists for the current session
   */
  const checkExpertProfile = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('auth_id', userId)
        .single();
      
      return !!data && !error;
    } catch (error) {
      console.error('Error checking expert profile:', error);
      return false;
    }
  };

  /**
   * Checks if there's a current active session for a regular user
   */
  const isUserLoggedIn = async (): Promise<boolean> => {
    try {
      // Check for existing session
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        return false;
      }
      
      // If there's a session, check if there's a user profile
      const hasUserProfile = await checkUserProfile(data.session.user.id);
      return hasUserProfile;
    } catch (error) {
      console.error('Error checking for user login:', error);
      return false;
    }
  };

  /**
   * Logs in the expert user
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    if (loginInProgress) {
      console.log('Expert login already in progress, aborting');
      return false;
    }
    
    try {
      setLoginInProgress(true);
      setLoading(true);
      
      console.log('Expert auth: Starting authentication');
      
      // First, check if a user is already logged in
      const userIsLoggedIn = await isUserLoggedIn();
      if (userIsLoggedIn) {
        console.error('Expert login: A user is already logged in');
        toast.error('Please log out as a user before logging in as an expert');
        return false;
      }
      
      // Clean auth state before proceeding
      await supabase.auth.signOut({ scope: 'local' });
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Expert login error:', error);
        toast.error('Login failed: ' + error.message);
        return false;
      }
      
      if (!data.user) {
        console.error('Expert login: No user data returned');
        toast.error('Login failed: No user data returned');
        return false;
      }
      
      // Before setting the expert profile, verify that it actually exists
      const hasExpertProfile = await checkExpertProfile(data.user.id);
      if (!hasExpertProfile) {
        console.error('Expert login: No expert profile found for this user');
        toast.error('No expert profile found for this account. Please contact support.');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('Expert auth: Successfully authenticated, fetching expert profile');
      
      // Check if there's an expert profile for this user
      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        console.error('Expert login: No expert profile found for this user');
        toast.error('No expert profile found for this account. Please contact support.');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('Expert auth: Profile found, setting expert state');
      
      // Set the expert data
      setExpert(expertProfile);
      
      toast.success('Expert login successful');
      return true;
    } catch (error) {
      console.error('Expert login unexpected error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setLoading(false);
      setLoginInProgress(false);
    }
  };

  return { login, loginInProgress };
};
