
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { UserSettings } from '@/types/user';
import { toast } from 'sonner';

export const useProfile = (user: any, setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>) => {
  const [profileLoading, setProfileLoading] = useState(false);

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update profile');
      return false;
    }
    
    try {
      setProfileLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }
      
      // Update local state
      setCurrentUser(current => current ? { ...current, ...updates } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    } finally {
      setProfileLoading(false);
    }
  };

  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update settings');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Settings update error:', error);
        toast.error('Failed to update settings: ' + error.message);
        return false;
      }
      
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error('An error occurred while updating settings');
      return false;
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      return null;
    }
    
    try {
      setProfileLoading(true);
      
      // Fetch basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Not found - new user, no profile yet
          console.log('No profile found for user, may be a new user');
          return null;
        } else {
          console.error('Error fetching profile:', profileError);
          throw new Error('Failed to load user profile');
        }
      }
      
      return profile as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user settings
  const fetchUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user settings:', error);
        return null;
      }
      
      return data as UserSettings;
    } catch (error) {
      console.error('Error in fetchUserSettings:', error);
      return null;
    }
  };

  return {
    updateProfile,
    updateUserSettings,
    fetchUserProfile,
    fetchUserSettings,
    profileLoading,
  };
};
