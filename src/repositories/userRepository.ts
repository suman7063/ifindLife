
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';

export const userRepository = {
  async getUser(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getUserByAuthId(authId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user by auth ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserByAuthId:', error);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
};
