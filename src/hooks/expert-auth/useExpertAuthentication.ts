
import { useExpertLogin } from './auth/useExpertLogin';
import { useExpertLogout } from './auth/useExpertLogout';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { ExpertProfile, ExpertRegistrationData } from './types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

  // Check if user is logged in
  const isUserLoggedIn = async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return false;
      
      // Check if there's a profile in the 'profiles' table for this user
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      // If there's no error and we have profile data, the user is logged in
      return !!profileData && !error;
    } catch (error) {
      console.error('Error checking user login status:', error);
      return false;
    }
  };

  // Clean the auth state before login to prevent dual sessions
  const cleanAuthState = async (): Promise<void> => {
    console.log('Expert auth: Cleaning auth state before login');
    
    try {
      // Sign out from Supabase to clear current session
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear any Supabase-related items from localStorage
      const storageKeys = Object.keys(localStorage);
      const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
      
      supabaseKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Expert auth: Auth state cleaned successfully');
    } catch (e) {
      console.warn('Error cleaning auth state:', e);
    }
  };

  // Enhanced login to prevent dual sessions
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Expert auth: Starting login process for', email);
    
    try {
      // Check if a user is already logged in
      const userLoggedIn = await isUserLoggedIn();
      if (userLoggedIn) {
        console.error('Expert auth: A user is already logged in');
        toast.error('Please log out as a user before logging in as an expert');
        return false;
      }
      
      // First ensure we're properly logged out to prevent session issues
      await cleanAuthState();
      
      console.log('Expert auth: Previous sessions cleared, proceeding with login');
      
      // Now proceed with expert login
      const success = await expertLogin(email, password);
      
      if (success) {
        console.log('Expert auth: Successfully authenticated, fetching expert profile');
        // The profile fetch is handled within expertLogin
        return true;
      } else {
        console.error('Expert auth: Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Expert auth: Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    }
  };

  // Improved logout that ensures clean state
  const logout = async (): Promise<boolean> => {
    try {
      console.log('Expert auth: Initiating logout process');
      
      // First reset our expert state
      setExpert(null);
      
      // Then perform actual logout
      await expertLogout();
      
      // After successful logout, force a page reload
      window.location.href = '/expert-login';
      return true;
    } catch (error) {
      console.error('Expert auth: Logout error:', error);
      return false;
    }
  };

  return { login, logout, register, isUserLoggedIn };
};
