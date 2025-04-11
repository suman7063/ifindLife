
import { UserProfile } from '@/types/supabase/userProfile';
import { supabase as supabaseClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Update function that references avatar_url
export const updateProfile = async (
  data: Partial<UserProfile>, 
  user?: User | null,
  refreshProfile?: () => Promise<void>
): Promise<boolean> => {
  try {
    if (!user) {
      console.error('No authenticated user');
      return false;
    }
    
    // Extract profile_picture from data if it exists (might be called avatar_url in some parts)
    const { profile_picture, ...restData } = data;
    
    const updateData = {
      ...restData,
      // Use profile_picture if it exists in the data
      ...(profile_picture && { profile_picture })
    };
    
    // Make the update
    const { error } = await supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
    
    if (error) throw error;
    
    // Refresh the profile
    if (refreshProfile) {
      await refreshProfile();
    }
    return true;
  } catch (err) {
    console.error('Error updating profile:', err);
    return false;
  }
};
