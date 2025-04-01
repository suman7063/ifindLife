
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '../types';

/**
 * Hook for handling expert logout functionality
 */
export const useExpertLogout = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /**
   * Logs out the current expert user
   */
  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Expert logout: Starting logout process');
      
      // First clear the expert state
      setExpert(null);
      
      // Ensure a complete logout using scope: 'local' to only log out current tab/window
      // This allows user context to remain logged in if present in another tab
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (error) {
        console.error('Expert logout error:', error);
        toast.error('Failed to log out: ' + error.message);
        throw error;
      }
      
      // Additional cleanup to ensure auth state is fully reset
      try {
        // Manually clear any lingering session data
        // This will clear all Supabase-related items from localStorage
        const storageKeys = Object.keys(localStorage);
        const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
        
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Error cleaning up local storage:', e);
      }
      
      toast.success('Logged out successfully as expert');
      return true;
    } catch (error) {
      console.error('Expert logout error:', error);
      toast.error('Failed to log out as expert');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
