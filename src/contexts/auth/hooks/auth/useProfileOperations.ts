
import { useCallback } from 'react';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export const useProfileOperations = (state: any) => {
  const refreshUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!state.user?.id) return null;
    return await userRepository.getUser(state.user.id);
  }, [state.user?.id]);

  const refreshExpertProfile = useCallback(async (): Promise<ExpertProfile | null> => {
    if (!state.user?.id) return null;
    return await expertRepository.getExpertByAuthId(state.user.id);
  }, [state.user?.id]);
  
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user?.id) return;
    
    try {
      const sessionType = localStorage.getItem('sessionType') || 'user';
      
      if (sessionType === 'expert' || sessionType === 'dual') {
        await expertRepository.getExpertByAuthId(state.user.id);
      }
      
      if (sessionType === 'user' || sessionType === 'dual') {
        await userRepository.getUser(state.user.id);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user?.id]);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!state.user?.id) return false;
    return await userRepository.updateUser(state.user.id, updates);
  }, [state.user?.id]);

  const updateExpertProfile = useCallback(async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!state.expertProfile?.id) return false;
    return await expertRepository.updateExpert(state.expertProfile.id, updates);
  }, [state.expertProfile?.id]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    return await updateUserProfile(updates);
  }, [updateUserProfile]);

  return {
    refreshUserProfile,
    refreshExpertProfile,
    refreshProfile,
    updateUserProfile,
    updateExpertProfile,
    updateProfile
  };
};
