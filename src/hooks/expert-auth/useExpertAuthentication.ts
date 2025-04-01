
import { useExpertLogin } from './auth/useExpertLogin';
import { useExpertLogout } from './auth/useExpertLogout';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { ExpertProfile, ExpertRegistrationData } from './types';
import { supabase } from '@/lib/supabase';

/**
 * Main hook that combines all expert authentication operations
 */
export const useExpertAuthentication = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  // Login functionality
  const { login: expertLogin } = useExpertLogin(setExpert, setLoading, fetchExpertProfile);
  
  // Logout functionality
  const { logout: expertLogout } = useExpertLogout(setExpert, setLoading);
  
  // Registration functionality
  const { register } = useExpertRegistration(setExpert, setLoading);

  // Enhanced login to prevent dual sessions
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Expert auth: Starting login process for', email);
    
    try {
      // First ensure we're properly logged out to prevent session issues
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local storage to be extra safe
      try {
        const storageKeys = Object.keys(localStorage);
        const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
        
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Error cleaning up local storage:', e);
      }
      
      console.log('Expert auth: Previous sessions cleared, proceeding with login');
      
      // Now proceed with expert login
      const success = await expertLogin(email, password);
      
      if (success) {
        console.log('Expert auth: Successfully authenticated, fetching expert profile');
      } else {
        console.error('Expert auth: Authentication failed');
      }
      
      return success;
    } catch (error) {
      console.error('Expert auth: Login error:', error);
      return false;
    }
  };

  return { login, logout: expertLogout, register };
};
