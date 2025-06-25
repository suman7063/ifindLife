
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from './types';
import { useState } from 'react';

/**
 * Hook for handling expert login functionality
 * FIXED: Now uses correct expert profile fetching
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
      console.log('🔒 Expert login already in progress, aborting');
      return false;
    }
    
    try {
      setLoginInProgress(true);
      setLoading(true);
      
      console.log('🔒 Expert auth: Starting authentication for:', email);
      
      // Clean auth state before proceeding
      await supabase.auth.signOut({ scope: 'local' });
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('🔒 Expert login error:', error);
        toast.error('Login failed: ' + error.message);
        return false;
      }
      
      if (!data.user) {
        console.error('🔒 Expert login: No user data returned');
        toast.error('Login failed: No user data returned');
        return false;
      }
      
      // Fetch expert profile after successful login using FIXED function
      console.log('🔒 Expert auth: Successfully authenticated, fetching expert profile');
      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        console.error('🔒 Expert login: No approved expert profile found for this user');
        toast.error('No approved expert profile found for this account. Please contact support.');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        return false;
      }
      
      // Check expert approval status (redundant but good for clarity)
      if (expertProfile.status === 'pending') {
        console.error('🔒 Expert login: Account is pending approval');
        toast.info('Your account is pending approval. You will be notified once approved.');
        
        // Sign out since this expert is not approved yet
        await supabase.auth.signOut();
        
        // Redirect to the expert login page with status=pending
        window.location.href = '/expert-login?status=pending';
        return false;
      }
      
      if (expertProfile.status === 'disapproved') {
        console.error('🔒 Expert login: Account is disapproved');
        toast.error('Your account has been disapproved. Please check your email for details.');
        
        // Sign out since this expert is disapproved
        await supabase.auth.signOut();
        
        // Redirect to the expert login page with status=disapproved
        window.location.href = '/expert-login?status=disapproved';
        return false;
      }
      
      if (expertProfile.status !== 'approved') {
        console.error(`🔒 Expert login: Unknown account status: ${expertProfile.status}`);
        toast.error('Your account has an unknown status. Please contact support.');
        
        // Sign out since this expert has an unknown status
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('🔒 Expert auth: Profile found and approved, setting expert state');
      
      // Set the expert data
      setExpert(expertProfile);
      
      toast.success('Expert login successful');
      return true;
    } catch (error) {
      console.error('🔒 Expert login unexpected error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setLoading(false);
      setLoginInProgress(false);
    }
  };

  return { login, loginInProgress };
};
