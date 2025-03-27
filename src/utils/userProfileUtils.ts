
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';

// Function to update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<boolean> => {
  try {
    console.log("Updating profile for user:", userId, "with data:", data);
    
    // Convert camelCase to snake_case for database
    const dbData: any = {
      name: data.name,
      phone: data.phone,
      country: data.country,
      city: data.city,
      currency: data.currency
    };

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
      console.error('Error updating user profile:', error);
      return false;
    }
    
    console.log("Profile updated successfully");
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Function to upload and update profile picture
export const updateProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    console.log("Starting file upload process for user:", userId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    console.log("Generated file path:", filePath);
    
    // Upload file to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    console.log("File uploaded successfully:", uploadData?.path);
    
    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const publicUrl = data.publicUrl;
    console.log("Generated public URL:", publicUrl);
    
    // Update user profile with the new profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }
    
    console.log("Profile picture URL updated in database");
    return publicUrl;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};
