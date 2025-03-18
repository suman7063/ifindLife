
import { supabase } from '@/lib/supabase';
import { UserProfile, UserProfileDb, UserUpdate } from '@/types/supabase';
import { camelToSnake } from './dataFormatters';

// Function to update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<boolean> => {
  try {
    // Convert camelCase data to snake_case for database
    const dbData = camelToSnake(data) as Record<string, any>;
    
    // Only include defined properties
    Object.keys(dbData).forEach(key => {
      if (dbData[key] === undefined) {
        delete dbData[key];
      }
    });

    const { error } = await supabase
      .from('users')
      .update(dbData)
      .eq('id', userId);

    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Function to upload and update profile picture
export const updateProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const publicUrl = data.publicUrl;
    
    // Update user profile with the new profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return publicUrl;
  } catch (error) {
    throw error;
  }
};
