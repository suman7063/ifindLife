
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useUserProfileManagement = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const updateProfileData = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) {
      toast.error('Please log in to update your profile');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', currentUser.id);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        ...profileData,
      };
      setCurrentUser(updatedUser);

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return {
    updateProfileData
  };
};
