
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from './types';
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
      
      // Check if there's an expert profile for this user
      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        console.error('Expert login: No expert profile found for this user');
        toast.error('No expert profile found for this account');
        return false;
      }
      
      // Check if expert is approved
      if (expertProfile.status !== 'approved') {
        console.error(`Expert login: Account status is ${expertProfile.status}`);
        
        if (expertProfile.status === 'pending') {
          toast.info('Your account is pending approval. You will be notified once approved.');
        } else if (expertProfile.status === 'disapproved') {
          toast.error('Your account application has been disapproved.');
        } else {
          toast.error(`Your account status is ${expertProfile.status}. Please contact support.`);
        }
        
        return false;
      }
      
      console.log('Expert auth: Login successful, profile found with status:', expertProfile.status);
      
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
