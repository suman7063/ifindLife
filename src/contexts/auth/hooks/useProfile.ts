
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/userProfile';
import { User } from '@supabase/supabase-js';
import { UserSettings } from '@/types/user';
import { toast } from 'sonner';

export const useProfile = (user: User | null, setUserProfile: (profile: UserProfile | null) => void) => {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  
  // Fetch user profile from API
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return profile as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);
  
  // Fetch user settings
  const fetchUserSettings = useCallback(async (userId: string): Promise<UserSettings | null> => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, create default settings
          return await createDefaultUserSettings(userId);
        }
        console.error('Error fetching user settings:', error);
        return null;
      }
      
      setUserSettings(data as UserSettings);
      return data as UserSettings;
    } catch (error) {
      console.error('Error in fetchUserSettings:', error);
      return null;
    }
  }, []);
  
  // Create default settings for new users
  const createDefaultUserSettings = async (userId: string): Promise<UserSettings | null> => {
    try {
      const defaultSettings: UserSettings = {
        user_id: userId,
        theme: 'system' as 'light' | 'dark' | 'system', // Type casting to match the enum
        notifications_enabled: true,
        email_notifications: true,
        newsletter: false,
        two_factor_auth: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'english'
      };
      
      const { data, error } = await supabase
        .from('user_settings')
        .insert(defaultSettings)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating default settings:', error);
        return null;
      }
      
      setUserSettings(data as UserSettings);
      return data as UserSettings;
    } catch (error) {
      console.error('Error in createDefaultUserSettings:', error);
      return null;
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id);
        
      if (error) {
        toast.error('Failed to update profile');
        console.error('Error updating profile:', error);
        return false;
      }
      
      // Fetch updated profile to ensure we have latest data
      const updatedProfile = await fetchUserProfile(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error('Failed to retrieve updated profile');
        return false;
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('An unexpected error occurred');
      return false;
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
        toast.error('Failed to update settings');
        console.error('Error updating settings:', error);
        return false;
      }
      
      // Update local state with new settings
      setUserSettings(prev => prev ? { ...prev, ...settings } : null);
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateUserSettings:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };
  
  return {
    userSettings,
    fetchUserProfile,
    fetchUserSettings,
    updateProfile,
    updateUserSettings
  };
};
