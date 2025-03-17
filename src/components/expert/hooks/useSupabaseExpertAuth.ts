
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { ExpertFormData } from '../types';
import { ExpertProfile } from '@/types/supabase';

export const useSupabaseExpertAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Verify if this is an expert account
        // @ts-ignore - We know the experts table exists in our system
        const { data: expertData, error: expertError } = await supabase
          .from('experts')
          .select('*')
          .eq('email', email)
          .single();

        if (expertError || !expertData) {
          toast.error('This account is not registered as an expert.');
          await supabase.auth.signOut();
          return false;
        }

        toast.success(`Welcome back, ${expertData.name}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const signup = async (expertData: ExpertFormData): Promise<boolean> => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: expertData.email,
        password: expertData.password,
        options: {
          data: {
            name: expertData.name,
            phone: expertData.phone,
            country: expertData.country
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (!data.user) {
        toast.error('Failed to create user account');
        return false;
      }

      // Now create the expert profile
      // @ts-ignore - We know the experts table exists in our system
      const { error: expertError } = await supabase
        .from('experts')
        .insert({
          id: data.user.id,
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
          certificate_urls: expertData.certificateUrls,
          profile_picture: expertData.profilePicture || null,
          selected_services: expertData.selectedServices,
          created_at: new Date().toISOString()
        });

      if (expertError) {
        console.error('Error creating expert profile:', expertError);
        toast.error('Error creating expert profile');
        return false;
      }

      toast.success('Expert account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const updateExpertProfile = async (expertId: string, profileData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      // @ts-ignore - We know the experts table exists in our system
      const { error } = await supabase
        .from('experts')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          specialization: profileData.specialization,
          experience: profileData.experience,
          bio: profileData.bio,
          certificate_urls: profileData.certificate_urls,
          profile_picture: profileData.profile_picture,
          selected_services: profileData.selected_services,
          updated_at: new Date().toISOString()
        })
        .eq('id', expertId);

      if (error) {
        toast.error('Failed to update profile');
        return false;
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
      return false;
    }
  };

  const reportUser = async (
    expertId: string, 
    reportData: { 
      userId: string; 
      userName: string; 
      reason: string; 
      details: string;
    }
  ): Promise<boolean> => {
    try {
      const newReport = {
        expert_id: expertId,
        user_id: reportData.userId,
        user_name: reportData.userName,
        reason: reportData.reason,
        details: reportData.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      // @ts-ignore - We know the expert_reports table exists in our system
      const { error } = await supabase
        .from('expert_reports')
        .insert(newReport);

      if (error) {
        toast.error('Failed to submit report');
        return false;
      }

      toast.success('User reported successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to report user');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      return false;
    }
  };

  const getExpertSession = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    setSession,
    login,
    signup,
    logout,
    getExpertSession,
    updateExpertProfile,
    reportUser
  };
};
