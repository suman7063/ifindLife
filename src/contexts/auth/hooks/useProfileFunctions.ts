
import { useCallback } from 'react';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export const useProfileFunctions = () => {
  const updateUserProfile = useCallback(async (userId: string, data: any): Promise<UserProfile | null> => {
    try {
      return await UserRepository.update(userId, data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }, []);

  const updateExpertProfile = useCallback(async (expertId: string, data: any): Promise<ExpertProfile | null> => {
    try {
      return await ExpertRepository.update(expertId, data);
    } catch (error) {
      console.error('Error updating expert profile:', error);
      return null;
    }
  }, []);

  return {
    updateUserProfile,
    updateExpertProfile
  };
};
