
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile, ExpertRegistrationData } from './types';

export const useExpertAuthentication = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  // Function to fetch expert profile from supabase
  const fetchExpertProfile = async (userId: string) => {
    try {
      console.log("Fetching expert profile for user ID:", userId);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }

      if (!data) {
        console.log('No expert profile found for this user');
        return null;
      }

      console.log('Expert profile retrieved:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Exception in fetchExpertProfile:', error);
      return null;
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
        toast.error('No expert profile found. Please register as an expert.');
        await supabase.auth.signOut();
        setLoading(false);
        return false;
      }
      
      setExpert(expertProfile);
      toast.success('Login successful!');
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

      // 2. Create expert profile
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: authData.user.id,
          name: expertData.name,
          email: expertData.email,
          phone: expertData.phone,
          address: expertData.address,
          city: expertData.city,
          state: expertData.state,
          country: expertData.country,
          specialization: expertData.specialization,
          experience: expertData.experience,
          bio: expertData.bio,
          certificate_urls: expertData.certificate_urls || [],
          selected_services: expertData.selected_services || []
        });

      if (profileError) {
        console.error('Error creating expert profile:', profileError);
        // Try to clean up the auth user since profile creation failed
        await supabase.auth.signOut();
        throw new Error('Failed to create expert profile: ' + profileError.message);
      }

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

  return { login, logout, register, fetchExpertProfile };
};
