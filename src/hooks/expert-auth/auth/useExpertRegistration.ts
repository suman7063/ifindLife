
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertRegistrationData } from '../types';
import { toast } from 'sonner';
import { handleAuthError } from '@/utils/authUtils';

export const useExpertRegistration = (
  setLoading: (loading: boolean) => void
) => {
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const register = async (data: ExpertRegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      setRegistrationError(null);
      
      console.log('Starting expert registration process for', data.email);
      
      // Check if there's an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        return false;
      }
      
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            specialization: data.specialization,
            experience: data.experience,
            bio: data.bio,
            certificate_urls: data.certificate_urls || [],
            selected_services: data.selected_services
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        setRegistrationError(authError.message);
        handleAuthError(authError, 'Registration failed');
        return false;
      }
      
      if (!authData.session) {
        setRegistrationError('Registration failed. No session created.');
        toast.error('Registration failed. No session created.');
        return false;
      }
      
      // Format data for expert profile
      const selectedServices = Array.isArray(data.selected_services) 
        ? data.selected_services.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : [];

      const expertExperience = typeof data.experience === 'number' 
        ? String(data.experience) 
        : (data.experience || '');

      // Create expert profile
      const expertData = {
        auth_id: authData.session.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        specialization: data.specialization || '',
        experience: expertExperience,
        bio: data.bio || '',
        certificate_urls: data.certificate_urls || [],
        selected_services: selectedServices,
        status: 'pending'
      };
      
      console.log('Creating expert profile for', data.email);
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        setRegistrationError(profileError.message);
        handleAuthError(profileError, 'Failed to create expert profile');
        
        // Clean up - sign out the created auth account
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('Expert registration successful for', data.email);
      
      // Sign out and redirect to login page
      await supabase.auth.signOut();
      
      // Don't redirect here, return success and let the component handle the redirect
      toast.success('Registration successful! Please log in with your credentials.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      handleAuthError(error, 'An unexpected error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { register, registrationError };
};
