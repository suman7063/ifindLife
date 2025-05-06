
import { useState } from 'react';
import { toast } from 'sonner';
import { ExpertFormValues } from '../schemas/expertFormSchema';
import { supabase } from '@/lib/supabase';

export const useExpertRegistrationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const handleSubmit = async (values: ExpertFormValues) => {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      console.log('Form submitted with values:', values);
      
      // Register the expert
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'expert',
          },
        },
      });
      
      if (error) {
        // Show the specific error message
        if (error.message.includes('User already registered')) {
          setRegistrationError('This email address is already registered. Please use the login tab instead.');
        } else {
          setRegistrationError(error.message || 'Registration failed');
        }
        return false;
      }
      
      if (!data.user?.id) {
        setRegistrationError('Registration failed. No user ID created.');
        return false;
      }
      
      // Convert experience to string since the database expects a string
      const expertExperience = String(values.experience);
      
      // Create expert profile with empty services array
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: data.user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          title: values.title,
          experience: expertExperience,
          specialties: values.specialties,
          bio: values.bio,
          selected_services: [], // Empty array for services
          status: 'pending',
        });
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        setRegistrationError(profileError.message || 'Failed to create expert profile.');
        return false;
      }
      
      toast.success('Registration successful! Your account is pending approval.');
      
      // Sign out after registration
      await supabase.auth.signOut();
      window.location.href = '/expert-login?status=registered';
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    registrationError,
    setRegistrationError
  };
};
