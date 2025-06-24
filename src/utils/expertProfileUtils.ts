
import { expertRepository } from '@/repositories/expertRepository';
import { ExpertProfile } from '@/types/database/unified';

/**
 * Update expert profile data
 */
export const updateExpertProfile = async (
  expertId: string, 
  updates: Partial<ExpertProfile>
): Promise<boolean> => {
  try {
    return await expertRepository.updateExpert(expertId, updates);
  } catch (error) {
    console.error('Error updating expert profile:', error);
    return false;
  }
};

/**
 * Update expert profile picture
 */
export const updateExpertProfilePicture = async (
  expertId: string,
  file: File
): Promise<string | null> => {
  try {
    // Note: This would need Supabase Storage setup
    // For now, return null as storage isn't configured
    console.log('Profile picture update requested for expert:', expertId);
    console.log('File:', file.name);
    
    // TODO: Implement storage upload when storage buckets are configured
    return null;
  } catch (error) {
    console.error('Error updating expert profile picture:', error);
    return null;
  }
};
