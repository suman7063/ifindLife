
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

/**
 * Update expert profile data
 */
export const updateExpertProfile = async (
  expertId: string, 
  updates: Partial<ExpertProfile>
): Promise<boolean> => {
  try {
    // Check if expert exists in expert_accounts
    const { data: expertData } = await supabase
      .from('expert_accounts')
      .select('auth_id')
      .eq('auth_id', expertId)
      .maybeSingle();

    const table = expertData ? 'expert_accounts' : 'experts';
    
    // Handle experience type - convert to string if needed
    const processedUpdates = {
      ...updates,
      experience: updates.experience !== undefined ? String(updates.experience) : undefined
    };
    
    // Update the appropriate table
    const { error } = await supabase
      .from(table)
      .update(processedUpdates)
      .eq(expertData ? 'auth_id' : 'id', expertId);
      
    return !error;
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
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${expertId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `expert_pictures/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const publicUrl = urlData.publicUrl;
    
    // Update expert profile with new picture URL
    const success = await updateExpertProfile(expertId, {
      profile_picture: publicUrl
    });
    
    return success ? publicUrl : null;
  } catch (error) {
    console.error('Error updating expert profile picture:', error);
    return null;
  }
};
