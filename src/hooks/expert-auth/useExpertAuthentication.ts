
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
      console.log('Expert login: Starting with email:', email);
      
      // First check for existing user session to prevent dual login
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .maybeSingle();
          
        if (profileData) {
          toast.error('You are already logged in as a user. Please log out first.');
          return false;
        }
      }
      
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
      toast.success('Successfully logged in as expert');
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
      toast.success('Logged out successfully');
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
      
      // Check for existing user session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        return false;
      }
      
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
      
      // Convert selected_services to number array
      const selectedServices = Array.isArray(data.selected_services) 
        ? data.selected_services.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : [];

      // Ensure experience is stored as string
      const expertExperience = typeof data.experience === 'number' 
        ? String(data.experience) 
        : (data.experience || '');

      // Create expert profile in expert_accounts table
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
        selected_services: selectedServices
      };
      
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
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
