
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
      
      console.log('Expert auth: Successfully authenticated, fetching expert profile');
      
      // Check if the user is already logged in as a regular user
      const hasUserProfile = await checkUserProfile(data.user.id);
      
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
