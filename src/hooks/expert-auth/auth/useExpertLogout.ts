
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useExpertLogout = (
  setExpert: (expert: null) => void,
  setLoading: (loading: boolean) => void,
  setIsUserLoggedIn: (isLoggedIn: boolean) => void
) => {
  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return false;
      }
      
      localStorage.removeItem('expertProfile');
      
      setExpert(null);
      setIsUserLoggedIn(false);
      toast.success('Logged out successfully');
      
      // Always redirect to home page after logout
      window.location.href = '/';
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { logout };
};
