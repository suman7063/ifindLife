
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
      // Ensure a complete logout using scope: 'global'
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Expert logout error:', error);
        toast.error('Failed to log out: ' + error.message);
        throw error;
      }
      
      setExpert(null);
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
