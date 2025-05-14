
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { userRepository } from '@/repositories/UserRepository';
import { expertRepository } from '@/repositories/ExpertRepository';
import { toast } from 'sonner';

export const useProfileFunctions = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Get user profile by ID
   */
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    
    try {
      return await userRepository.getUser(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };
  
  /**
   * Get expert profile by user ID
   */
  const getExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
    if (!userId) return null;
    
    try {
      return await expertRepository.getExpertByAuthId(userId);
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      return null;
    }
  };
  
  /**
   * Update user profile
   */
  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userId) {
      toast.error('User ID is required to update profile');
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await userRepository.updateUser(userId, updates);
      
      if (success) {
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error('Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update expert profile
   */
  const updateExpertProfile = async (expertId: string, updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!expertId) {
      toast.error('Expert ID is required to update profile');
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await expertRepository.updateExpert(expertId, updates);
      
      if (success) {
        toast.success('Expert profile updated successfully');
        return true;
      } else {
        toast.error('Failed to update expert profile');
        return false;
      }
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('An error occurred while updating your expert profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    getUserProfile,
    getExpertProfile,
    updateUserProfile,
    updateExpertProfile
  };
};
