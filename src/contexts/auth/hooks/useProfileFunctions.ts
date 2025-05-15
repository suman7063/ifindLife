
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useProfileFunctions = () => {
  const refreshUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      return await userRepository.getUser(userId);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      toast.error('Failed to refresh user profile');
      return null;
    }
  };
  
  const refreshExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
    try {
      return await expertRepository.getExpertByAuthId(userId);
    } catch (error) {
      console.error('Error refreshing expert profile:', error);
      toast.error('Failed to refresh expert profile');
      return null;
    }
  };
  
  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const success = await userRepository.updateUser(userId, updates);
      
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    }
  };
  
  const updateExpertProfile = async (id: string, updates: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      const success = await expertRepository.updateExpert(id, updates);
      
      if (success) {
        toast.success('Expert profile updated successfully');
      } else {
        toast.error('Failed to update expert profile');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    }
  };
  
  return {
    refreshUserProfile,
    refreshExpertProfile,
    updateUserProfile,
    updateExpertProfile
  };
};
