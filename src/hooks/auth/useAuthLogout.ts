
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useAuthLogout = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const logout = async (): Promise<boolean> => {
    try {
      setLogoutLoading(true);
      setLoading(true);
      
      console.log("useAuthLogout: Starting logout process...");
      
      // Complete sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures complete signout across all tabs/windows
      });
      
      if (error) {
        console.error("useAuthLogout: Error during signOut:", error);
        return false;
      }
      
      console.log("useAuthLogout: Logout completed successfully");
      return true;
    } catch (error) {
      console.error("useAuthLogout: Unexpected error during logout:", error);
      return false;
    } finally {
      setLogoutLoading(false);
      setLoading(false);
    }
  };

  return { logout, logoutLoading };
};
