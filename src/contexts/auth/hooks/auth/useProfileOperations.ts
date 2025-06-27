
import { useState } from 'react';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useProfileOperations = () => {
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (id: string, data: Partial<UserProfile>): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const result = await UserRepository.update(id, data);
      if (result) {
        toast.success('Profile updated successfully');
      }
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExpertProfile = async (id: string, data: Partial<ExpertProfile>): Promise<ExpertProfile | null> => {
    setLoading(true);
    try {
      const result = await ExpertRepository.update(id, data);
      if (result) {
        toast.success('Expert profile updated successfully');
      }
      return result;
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('Failed to update expert profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile,
    updateExpertProfile,
    loading
  };
};
