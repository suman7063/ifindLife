
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
      // First check if there's a previous session and sign out
      await supabase.auth.signOut();
      
      // Now perform the login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      if (!data.session) {
        toast.error('No session created');
        setLoading(false);
        return false;
      }

      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        // This is the key change - we handle the case where the user is authenticated
        // but doesn't have an expert profile
        toast.error('No expert profile found. Please register as an expert.');
        await supabase.auth.signOut();
        setLoading(false);
        navigate('/expert-login?register=true');
        return false;
      }
      
      setExpert(expertProfile);
      toast.success('Login successful!');
      navigate('/expert-dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setExpert(null);
      toast.success('Logged out successfully');
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
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
