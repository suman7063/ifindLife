
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '../types';

/**
 * Hook for handling expert login functionality
 */
export const useExpertLogin = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  /**
   * Authenticates an expert user with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log('Expert auth: Starting login process for', email);
      
      // First ensure we're signed out to prevent any auth state conflicts
      await supabase.auth.signOut({
        scope: 'global'
      });
      
      console.log('Expert auth: Previous sessions cleared, proceeding with login');
      
      // Now perform the login with explicit storage setting
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Expert auth login error:', error);
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      if (!data.session) {
        console.error('Expert auth: No session created');
        toast.error('No session created');
        setLoading(false);
        return false;
      }

      console.log('Expert auth: Successfully authenticated, fetching expert profile');
      
      // Fetch expert profile
      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        console.error('Expert auth: No expert profile found for user ID', data.user.id);
        // This user is authenticated but doesn't have an expert profile
        toast.error('No expert profile found. Please register as an expert.');
        await supabase.auth.signOut({
          scope: 'global'
        });
        setLoading(false);
        return false;
      }
      
      // Success! We have both authentication and an expert profile
      console.log('Expert auth: Profile found, setting expert state');
      setExpert(expertProfile);
      toast.success('Login successful!');
      
      // Force a reload to ensure clean state
      window.location.href = '/expert-dashboard';
      return true;
    } catch (error) {
      console.error('Unexpected error in expert login:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
