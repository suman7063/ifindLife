
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';

export interface UserCreateData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profile_picture?: string;
  wallet_balance?: number;
}

export class UserRepository {
  static async create(userData: UserCreateData): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async findById(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async update(id: string, userData: Partial<UserCreateData>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
