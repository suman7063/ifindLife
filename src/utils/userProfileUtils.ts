
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const fetchUserProfile = async (authUser: SupabaseUser): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      // Convert from Supabase profile format to our app's User format
      return {
        id: data.id,
        name: data.name,
        email: data.email || authUser.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        currency: data.currency || 'USD',
        profilePicture: data.profile_picture,
        walletBalance: Number(data.wallet_balance) || 0,
        favoriteExperts: [],  // We'll fetch these separately
        enrolledCourses: [],  // We'll fetch these separately
        transactions: [],     // We'll fetch these separately
        reviews: [],          // We'll fetch these separately
        reports: []           // We'll fetch these separately
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Error loading user profile');
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        phone: profileData.phone,
        country: profileData.country,
        city: profileData.city,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    toast.success('Profile updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(error.message || 'Failed to update profile');
    return false;
  }
};

export const updateProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    // Upload image to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    // Create a readable stream from the file
    const { error: uploadError } = await supabase.storage
      .from('user-profiles')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('user-profiles')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update profile with new picture URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profile_picture: publicUrl })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    toast.success('Profile picture updated successfully');
    return publicUrl;
  } catch (error: any) {
    console.error('Error updating profile picture:', error);
    toast.error(error.message || 'Failed to update profile picture');
    throw error;
  }
};
