
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/user';

export class UserRepository {
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

      // Adapt the database response to match UserProfile interface
      return {
        ...data,
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        transactions: []
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        ...data,
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        transactions: []
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userData.id!,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          country: userData.country,
          city: userData.city,
          currency: userData.currency || 'USD',
          profile_picture: userData.profile_picture,
          wallet_balance: userData.wallet_balance || 0
        }])
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating user:', error);
        return null;
      }

      return {
        ...data,
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        transactions: []
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async update(id: string, userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Only update fields that exist in the database
      const updateData: any = {};
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.country !== undefined) updateData.country = userData.country;
      if (userData.city !== undefined) updateData.city = userData.city;
      if (userData.currency !== undefined) updateData.currency = userData.currency;
      if (userData.profile_picture !== undefined) updateData.profile_picture = userData.profile_picture;
      if (userData.wallet_balance !== undefined) updateData.wallet_balance = userData.wallet_balance;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating user:', error);
        return null;
      }

      return {
        ...data,
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        transactions: []
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
