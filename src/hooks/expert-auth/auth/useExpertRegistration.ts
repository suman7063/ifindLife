
// This file has typical Supabase insert errors with auth_id field.
// Let's fix the expert registration flow by creating a utility function to format the data properly.

import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const registerExpertWithSupabase = async (userData: any) => {
  try {
    // First create the user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('Failed to create user');
    }
    
    // Then create expert profile with the auth ID
    const { error: expertError } = await supabase
      .from('expert_accounts')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        specialization: userData.specialization,
        experience: userData.experience,
        bio: userData.bio,
        certificate_urls: userData.certificate_urls,
        selected_services: userData.selected_services,
        auth_id: authData.user.id
      });
    
    if (expertError) {
      // Clean up the auth user if profile creation fails
      await supabase.auth.signOut();
      throw expertError;
    }
    
    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Expert registration error:', error);
    toast.error(error.message || 'Registration failed');
    return { success: false, error };
  }
};
