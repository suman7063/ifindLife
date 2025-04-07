
import { supabase } from '@/lib/supabase';

export const useUserAccountCheck = () => {
  const hasUserAccount = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking user account:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in hasUserAccount:', error);
      return false;
    }
  };
  
  return { hasUserAccount };
};
