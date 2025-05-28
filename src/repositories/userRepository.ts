
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

export const userRepository = {
  async getUser(userId: string): Promise<UserProfile | null> {
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
      
      // Try users table first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData && !userError) {
        console.log('User found in users table:', userData);
        return adaptUserProfile(userData);
      }

      // Try profiles table if not found in users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        console.log('User found in profiles table:', profileData);
        return adaptUserProfile(profileData);
      }

      console.log('User not found in either table');
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      console.log(`Updating user ${userId} with:`, updates);
      
      // Check which table has the user
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      const table = userData ? 'users' : 'profiles';
      console.log(`Updating in table: ${table}`);
      
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      console.log('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async createUser(userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('Creating user with data:', userData);
      
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      console.log('User created successfully:', data);
      return adaptUserProfile(data);
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }
};
