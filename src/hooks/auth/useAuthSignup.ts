
import { supabase } from '@/lib/supabase';
import { SignupData } from '../useSupabaseAuth';

export const useAuthSignup = (setLoading: (loading: boolean) => void) => {
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Attempting signup with:", userData.email);
      
      // Extract email and password from userData, everything else goes to metadata
      const { email, password, ...metadata } = userData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      console.log("Signup successful:", data);
      return true;
    } catch (err) {
      console.error('Exception in signup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup };
};
