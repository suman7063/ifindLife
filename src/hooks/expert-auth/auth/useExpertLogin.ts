
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '../types';
import { toast } from 'sonner';

export const useExpertLogin = (
  setExpert: (expert: ExpertProfile | null) => void,
  setLoading: (loading: boolean) => void,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('🔒 Expert auth: Starting login process for', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('🔒 Login error:', error);
        toast.error(error.message);
        return false;
      }
      
      if (!data.session) {
        console.error('🔒 Login failed: No session created');
        toast.error('Login failed. No session created.');
        return false;
      }
      
      console.log('🔒 Expert auth: Session created, checking for expert profile');
      
      // Use the FIXED fetchExpertProfile function
      const expertProfile = await fetchExpertProfile(data.session.user.id);
      
      if (!expertProfile) {
        console.error('🔒 Login failed: No approved expert profile found for authenticated user');
        toast.error('No approved expert profile found for this account.');
        
        // Sign out since there's no expert profile
        await supabase.auth.signOut({ scope: 'local' });
        return false;
      }
      
      // Check if expert is approved (redundant but good for clarity)
      if (expertProfile.status !== 'approved') {
        console.error(`🔒 Login failed: Expert status is ${expertProfile.status}`);
        
        // Sign out since the expert is not approved
        await supabase.auth.signOut({ scope: 'local' });
        
        if (expertProfile.status === 'pending') {
          toast.info('Your account is pending approval. You will be notified once approved.');
          
          // Redirect to login page with status
          window.location.href = '/expert-login?status=pending';
        } else if (expertProfile.status === 'disapproved') {
          toast.error('Your account application has been disapproved. Please check your email for details.');
          
          // Redirect to login page with status
          window.location.href = '/expert-login?status=disapproved';
        }
        
        return false;
      }
      
      console.log('🔒 Expert auth: Login successful for expert:', expertProfile.name);
      setExpert(expertProfile);
      setIsUserLoggedIn(true);
      toast.success('Login successful');
      
      return true;
    } catch (error) {
      console.error('🔒 Login error:', error);
      toast.error('An unexpected error occurred during login.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { login, isUserLoggedIn };
};
