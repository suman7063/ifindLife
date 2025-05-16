
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fallbackLogin = async (email: string, password: string): Promise<boolean> => {
  console.log('Using fallback login function with email:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Fallback login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    }
    
    if (!data.session) {
      console.error('Fallback login: No session created');
      toast.error('Login failed: No session created');
      return false;
    }
    
    console.log('Fallback login success');
    toast.success('Login successful');
    return true;
  } catch (error) {
    console.error('Unexpected error in fallback login:', error);
    toast.error('An unexpected error occurred during login');
    return false;
  }
};
