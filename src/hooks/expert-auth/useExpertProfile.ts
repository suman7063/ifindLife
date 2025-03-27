
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile } from './types';

export const useExpertProfile = (
  expert: ExpertProfile | null,
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Update expert profile
  const updateProfile = async (profileData: Partial<ExpertProfile>): Promise<boolean> => {
    if (!expert) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('id', expert.id);

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }

      // Refresh the expert data
      const { data } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (data) {
        setExpert(data as ExpertProfile);
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile };
};
