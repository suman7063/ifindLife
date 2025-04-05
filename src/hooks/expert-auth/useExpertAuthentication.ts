
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertRegistrationData } from './types';
import { toast } from 'sonner';

export const useExpertAuthentication = (
  setExpert: (expert: ExpertProfile | null) => void,
  setLoading: (loading: boolean) => void,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Check if email is registered as a user
  const hasUserAccount = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking user account:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in hasUserAccount:', error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.session) {
        toast.error('Login failed. No session created.');
        return false;
      }
      
      // Check if this user has an expert profile
      const expertProfile = await fetchExpertProfile(data.session.user.id);
      
      if (!expertProfile) {
        toast.error('No expert profile found for this account.');
        await supabase.auth.signOut();
        return false;
      }
      
      setExpert(expertProfile);
      setIsUserLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      setExpert(null);
      setIsUserLoggedIn(false);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Registration function
  const register = async (data: ExpertRegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create user in Supabase auth
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
            certificate_urls: data.certificate_urls,
            selected_services: data.selected_services
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.session) {
        toast.error('Registration failed. No session created.');
        return false;
      }
      
      // Create expert profile in expert_accounts table
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: authData.session.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          specialization: data.specialization,
          experience: data.experience,
          bio: data.bio,
          certificate_urls: data.certificate_urls,
          selected_services: data.selected_services
        });
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        toast.error(profileError.message);
        
        // Clean up user from auth if profile creation fails
        await supabase.auth.signOut();
        return false;
      }
      
      // Fetch the newly created expert profile
      const expertProfile = await fetchExpertProfile(authData.session.user.id);
      
      if (!expertProfile) {
        toast.error('Failed to fetch expert profile after registration.');
        return false;
      }
      
      setExpert(expertProfile);
      setIsUserLoggedIn(true);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    login,
    logout,
    register,
    isUserLoggedIn,
    hasUserAccount
  };
};
