import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { UserSettings } from '@/types/user';
import { userSettingsDefaults } from '@/data/userDefaults';

// Export the hooks and utility functions
export const useProfile = (user: User | null, setProfile: (profile: UserProfile | null) => void) => {
  // Function to update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }
      
      if (updatedProfile) {
        setProfile(updatedProfile as UserProfile);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error('Profile update failed: No data returned');
        return false;
      }
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      toast.error('An unexpected error occurred during profile update');
      return false;
    }
  };

  // Function to update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to update settings');
        return false;
      }
      
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating user settings:', error);
        toast.error('Failed to update user settings');
        return false;
      }
      
      toast.success('User settings updated successfully!');
      return true;
    } catch (error) {
      console.error('Unexpected error updating user settings:', error);
      toast.error('An unexpected error occurred during user settings update');
      return false;
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return userProfile as UserProfile;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  };

  // Function to fetch user settings
  const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
    try {
      const { data: userSettings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user settings:', error);
        return {
          user_id: userId,
          theme: userSettingsDefaults.theme,
          notifications_enabled: userSettingsDefaults.notificationsEnabled,
          email_notifications: userSettingsDefaults.emailNotifications,
          newsletter: userSettingsDefaults.newsletter,
          two_factor_auth: userSettingsDefaults.twoFactorAuth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: userSettingsDefaults.language
        };
      }
      
      return userSettings as UserSettings;
    } catch (error) {
      console.error('Unexpected error fetching user settings:', error);
      return null;
    }
  };

  return {
    updateProfile,
    updateUserSettings,
    fetchUserProfile,
    fetchUserSettings
  };
};
