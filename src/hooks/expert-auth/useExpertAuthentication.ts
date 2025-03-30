
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile, ExpertRegistrationData } from './types';

export const useExpertAuthentication = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const navigate = useNavigate();

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Expert auth: Starting login process for', email);
      // First ensure we're signed out
      await supabase.auth.signOut({
        scope: 'global'
      });
      
      // Now perform the login
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
        navigate('/expert-login?register=true');
        return false;
      }
      
      // Success! We have both authentication and an expert profile
      console.log('Expert auth: Profile found, setting expert state');
      setExpert(expertProfile);
      toast.success('Login successful!');
      navigate('/expert-dashboard');
      return true;
    } catch (error) {
      console.error('Unexpected error in expert login:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Ensure a complete logout using scope: 'global'
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Expert logout error:', error);
        toast.error('Failed to log out: ' + error.message);
        throw error;
      }
      
      setExpert(null);
      toast.success('Logged out successfully');
      
      // Force a full page reload to clear any lingering state
      window.location.href = '/expert-login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      
      // Force a page reload as a fallback
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // Register function that creates both auth user and expert profile
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
      
      // Make sure to propagate the error message
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, logout, register };
};
