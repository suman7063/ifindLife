
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertRegistrationData } from '../types';
import { toast } from 'sonner';

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
      
      // Create auth account with email verification enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=expert`,
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
            selected_services: data.selected_services,
            user_type: 'expert' // Mark this as an expert account
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        setRegistrationError(authError.message);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.session || !authData.user) {
        setRegistrationError('Registration failed. No session or user created.');
        toast.error('Registration failed. No session or user created.');
        return false;
      }
      
      console.log('Auth account created with ID:', authData.user.id);
      
      // Format data for expert profile
      const selectedServices = Array.isArray(data.selected_services) 
        ? data.selected_services.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : [];

      const expertExperience = typeof data.experience === 'number' 
        ? String(data.experience) 
        : (data.experience || '');

      // Create expert profile - selected_services removed from expert_accounts
      const expertData = {
        auth_id: authData.user.id,
        user_id: authData.user.id, // Set both for compatibility
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
        // selected_services removed - will be saved to expert_service_specializations
        status: 'pending'
      };
      
      console.log('Creating expert profile for', data.email);
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        setRegistrationError(profileError.message);
        toast.error('Failed to create expert profile: ' + profileError.message);
        
        // Clean up - sign out the created auth account
        await supabase.auth.signOut();
        return false;
      }
      
      // Save services to expert_service_specializations table
      if (selectedServices.length > 0) {
        const specializations = selectedServices.map((serviceId, index) => ({
          expert_id: authData.user.id,
          service_id: String(serviceId), // Database has UUID, but types expect number - using string
          is_available: true,
          is_primary_service: index === 0
        })) as unknown as Array<{ expert_id: string; service_id: number; is_available: boolean; is_primary_service: boolean }>; // Type assertion needed due to type mismatch (DB has UUID but types expect number)
        
        const { error: servicesError } = await supabase
          .from('expert_service_specializations')
          .insert(specializations);
        
        if (servicesError) {
          console.error('Error saving services:', servicesError);
          // Don't fail registration if services fail, just log it
        }
      }
      
      console.log('Expert registration successful for', data.email);
      
      // Note: Welcome email will be sent when onboarding is completed, not during registration
      // Sign out and let the component handle the redirect
      await supabase.auth.signOut();
      
      toast.success('Registration successful! Please verify your email, then wait for admin approval before logging in.');
      return true;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during registration';
      setRegistrationError(errorMessage);
      toast.error('Registration error: ' + errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { register, registrationError };
};
