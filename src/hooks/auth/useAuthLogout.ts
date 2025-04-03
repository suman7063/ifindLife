
import { supabase } from '@/lib/supabase';

// Convert this to a function that returns hooks rather than using hooks directly
export const useAuthLogout = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  // Move the useState inside the returned function
  const logout = async (): Promise<boolean> => {
    try {
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
      setLoading(false);
    }
  };

  return { logout, logoutLoading: false };
};
