
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
      
      console.log('Expert Registration: Form submitted with values:', values);
      
      // Check for existing session and sign out if necessary
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        console.log('Expert Registration: Found existing session, signing out first');
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Check if user with this email already exists as a regular user
      const { data: existingUserData, error: userCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.email)
        .maybeSingle();
        
      if (existingUserData) {
        console.error('Expert Registration: This email is already registered as a user');
        setRegistrationError('This email is already registered as a user. Please use a different email address.');
        setIsSubmitting(false);
        return false;
      }
      
      // Check if expert with this email already exists
      const { data: existingExpertData, error: expertCheckError } = await supabase
        .from('expert_accounts')
        .select('id, email')
        .eq('email', values.email)
        .maybeSingle();
        
      if (existingExpertData) {
        console.error('Expert Registration: This email is already registered as an expert');
        setRegistrationError('This email is already registered. Please use the login tab instead.');
        setIsSubmitting(false);
        return false;
      }
      
      // Register the expert with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'expert',
            name: values.name,
            phone: values.phone
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
        setIsSubmitting(false);
        return false;
      }
      
      if (!data.user?.id) {
        setRegistrationError('Registration failed. No user ID created.');
        setIsSubmitting(false);
        return false;
      }
      
      console.log('Expert Registration: Auth account created with ID:', data.user.id);
      
      // Convert experience to string since the database expects a string
      const expertExperience = String(values.experience);
      
      // CRITICAL: Create expert profile ONLY, not a regular profile
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
          specialization: values.specialties?.join(', '),
          experience: expertExperience,
          bio: values.bio,
          selected_services: [], // Empty array for services
          status: 'pending',
        });
        
      if (profileError) {
        console.error('Expert Registration: Profile creation error:', profileError);
        setRegistrationError(profileError.message || 'Failed to create expert profile.');
        
        // Clean up - delete the auth user since the profile creation failed
        try {
          // This would require admin rights - commented out as it's likely not possible from client
          // await supabase.auth.admin.deleteUser(data.user.id);
          console.log('Expert Registration: Auth user created but profile creation failed. Manual cleanup may be required.');
        } catch (cleanupError) {
          console.error('Expert Registration: Error cleaning up auth user:', cleanupError);
        }
        
        setIsSubmitting(false);
        return false;
      }
      
      console.log('Expert Registration: Expert profile created successfully');
      toast.success('Registration successful! Your account is pending approval.');
      
      // Sign out after registration
      await supabase.auth.signOut();
      window.location.href = '/expert-login?status=registered';
      
      setIsSubmitting(false);
      return true;
    } catch (error: any) {
      console.error('Expert Registration: Error:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    registrationError,
    setRegistrationError
  };
};
