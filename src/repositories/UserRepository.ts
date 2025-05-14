
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';
import { convertUserToUserProfile } from '@/utils/profileConverters';

class UserRepository {
  /**
   * Get a user by ID
   */
  async getUser(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      return convertUserToUserProfile(data);
    } catch (error) {
      console.error('Repository error in getUser:', error);
      return null;
    }
  }
  
  /**
   * Update a user's profile
   */
  async updateUser(id: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Repository error in updateUser:', error);
      return false;
    }
  }
  
  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Error fetching user by email:', error);
        return null;
      }
      
      return convertUserToUserProfile(data);
    } catch (error) {
      console.error('Repository error in getUserByEmail:', error);
      return null;
    }
  }
}

export const userRepository = new UserRepository();
