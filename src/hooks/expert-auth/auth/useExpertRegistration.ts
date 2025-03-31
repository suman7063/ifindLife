
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertRegistrationData } from '../types';

/**
 * Hook for handling expert registration functionality
 */
export const useExpertRegistration = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /**
   * Registers a new expert user and creates their profile
   */
  const register = async (expertData: ExpertRegistrationData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Check for any validation issues before proceeding
      if (!expertData.email || !expertData.password || !expertData.name) {
        throw new Error('Missing required fields: name, email or password');
      }
      
      console.log('Starting registration process with data:', { 
        name: expertData.name, 
        email: expertData.email,
        // Don't log password for security
      });
      
      // Ensure we don't have an existing session before signup
      await supabase.auth.signOut({ scope: 'local' });
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: expertData.email,
        password: expertData.password,
        options: {
          data: {
            name: expertData.name,
            role: 'expert'
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        
        // Handle the specific case of already registered users
        if (authError.message.includes('User already registered')) {
          console.log('Email already registered:', expertData.email);
          throw new Error('Email is already registered. Please use a different email or try logging in.');
        }
        
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }
      
      console.log('Auth user created with ID:', authData.user.id);

      // 2. Create expert profile with explicit auth_id
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: authData.user.id,
          name: expertData.name,
          email: expertData.email,
          phone: expertData.phone || null,
          address: expertData.address || null,
          city: expertData.city || null,
          state: expertData.state || null,
          country: expertData.country || null,
          specialization: expertData.specialization || null,
          experience: expertData.experience || null,
          bio: expertData.bio || null,
          certificate_urls: expertData.certificate_urls || [],
          selected_services: expertData.selected_services || []
        });

      if (profileError) {
        console.error('Error creating expert profile:', profileError);
        // Try to clean up the auth user since profile creation failed
        try {
          await supabase.auth.signOut();
          console.log('Cleaned up auth user after profile creation failure');
        } catch (cleanupError) {
          console.error('Failed to clean up auth user:', cleanupError);
        }
        throw new Error('Failed to create expert profile: ' + profileError.message);
      }
      
      console.log('Expert profile created successfully');

      toast.success('Registration successful! Please check your email for verification.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register };
};
