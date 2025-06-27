
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';

export interface UserCreateData {
  id: string; // Add required id field
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

      // Return complete UserProfile with all required properties
      return {
        ...data,
        favorite_experts: data.favorite_experts || [],
        favorite_programs: data.favorite_programs || [],
        enrolled_courses: data.enrolled_courses || [],
        reviews: data.reviews || [],
        recent_activities: data.recent_activities || [],
        upcoming_appointments: data.upcoming_appointments || [],
        transactions: data.transactions || [],
        reports: data.reports || [],
        referrals: data.referrals || []
      };
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

      // Return complete UserProfile with all required properties
      return {
        ...data,
        favorite_experts: data.favorite_experts || [],
        favorite_programs: data.favorite_programs || [],
        enrolled_courses: data.enrolled_courses || [],
        reviews: data.reviews || [],
        recent_activities: data.recent_activities || [],
        upcoming_appointments: data.upcoming_appointments || [],
        transactions: data.transactions || [],
        reports: data.reports || [],
        referrals: data.referrals || []
      };
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

      // Return complete UserProfile with all required properties
      return {
        ...data,
        favorite_experts: data.favorite_experts || [],
        favorite_programs: data.favorite_programs || [],
        enrolled_courses: data.enrolled_courses || [],
        reviews: data.reviews || [],
        recent_activities: data.recent_activities || [],
        upcoming_appointments: data.upcoming_appointments || [],
        transactions: data.transactions || [],
        reports: data.reports || [],
        referrals: data.referrals || []
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
