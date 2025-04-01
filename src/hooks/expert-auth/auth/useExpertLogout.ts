
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
      
      // Ensure a complete logout using scope: 'global'
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Expert logout error:', error);
        toast.error('Failed to log out: ' + error.message);
        throw error;
      }
      
      // Additional cleanup to ensure auth state is fully reset
      try {
        // Manually clear any lingering session data
        localStorage.removeItem('sb-' + supabase.supabaseUrl + '-auth-token');
      } catch (e) {
        console.warn('Error cleaning up local storage:', e);
      }
      
      toast.success('Logged out successfully');
      
      // Force a full page reload to clear any lingering state
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      
      // Force a page reload as a fallback
      window.location.href = '/';
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
