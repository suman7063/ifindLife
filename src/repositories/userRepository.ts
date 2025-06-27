
import { supabase } from '@/lib/supabase';
import { UserProfile, UserProfileUpdate } from '@/types/database/unified';

export class UserRepository {
  static async create(userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const insertData = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        city: userData.city || '',
        currency: userData.currency || 'USD',
        profile_picture: userData.profile_picture || '',
        referral_code: userData.referral_code || '',
        referral_link: userData.referral_link || '',
        referred_by: userData.referred_by || '',
        wallet_balance: userData.wallet_balance || 0,
        favorite_experts: userData.favorite_experts || [],
        favorite_programs: userData.favorite_programs || [],
        enrolled_courses: userData.enrolled_courses || [],
        reviews: userData.reviews || [],
        recent_activities: userData.recent_activities || [],
        upcoming_appointments: userData.upcoming_appointments || [],
        transactions: userData.transactions || [],
        reports: userData.reports || [],
        referrals: userData.referrals || []
      };

      const { data, error } = await supabase
        .from('users')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async findByAuthId(authId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authId)
        .single();

      if (error || !data) {
        return null;
      }

      // Ensure all required arrays exist
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
      } as UserProfile;
    } catch (error) {
      console.error('Error finding user by auth ID:', error);
      return null;
    }
  }

  static async update(id: string, userData: UserProfileUpdate): Promise<UserProfile | null> {
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

      // Ensure all required arrays exist
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
      } as UserProfile;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
