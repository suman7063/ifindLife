
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getCurrencyByCountry, handleAuthError } from '@/utils/authUtils';

export const useAuthSignup = (setLoading: (value: boolean) => void) => {
  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      // Determine currency based on country
      const currency = getCurrencyByCountry(userData.country);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
            currency
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup };
};
