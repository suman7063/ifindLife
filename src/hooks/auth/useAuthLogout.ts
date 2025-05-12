
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useAuthLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      
      console.log("useAuthLogout: Starting logout process...");
      
      // Complete sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures complete signout across all tabs/windows
      });
      
      if (error) {
        console.error("useAuthLogout: Error during signOut:", error);
        toast.error(`Logout failed: ${error.message}`);
        return false;
      }
      
      // Show success toast and redirect to home page
      toast.success('Successfully logged out');
      console.log("useAuthLogout: Logout completed successfully, redirecting to home");
      
      // Redirect to home page
      navigate('/');
      
      return true;
    } catch (error) {
      console.error("useAuthLogout: Unexpected error during logout:", error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

export default useAuthLogout;
