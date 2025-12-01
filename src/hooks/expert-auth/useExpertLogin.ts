
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
      
      // Fetch expert profile after successful login
      console.log('Expert auth: Successfully authenticated, fetching expert profile');
      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        console.error('Expert login: No expert profile found for this user');
        toast.error('No expert profile found for this account. Please contact support.');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        return false;
      }
      
      // Check expert approval status
      if (expertProfile.status === 'pending') {
        console.error('Expert login: Account is pending approval');
        toast.info('Your account is pending approval. You will be notified once approved.');
        
        // Sign out since this expert is not approved yet
        await supabase.auth.signOut();
        
        // Redirect to the expert login page with status=pending
        window.location.href = '/expert-login?status=pending';
        return false;
      }
      
      if (expertProfile.status === 'rejected') {
        console.error('Expert login: Account is rejected');
        toast.error('Your account has been rejected. Please check your email for details.');
        
        // Sign out since this expert is rejected
        await supabase.auth.signOut();
        
        // Redirect to the expert login page with status=rejected
        window.location.href = '/expert-login?status=rejected';
        return false;
      }
      
      if (expertProfile.status !== 'approved') {
        console.error(`Expert login: Unknown account status: ${expertProfile.status}`);
        toast.error('Your account has an unknown status. Please contact support.');
        
        // Sign out since this expert has an unknown status
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('Expert auth: Profile found and approved, setting expert state');
      
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
