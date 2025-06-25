
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export const expertRepository = {
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      // FIXED: Use correct table name and column name
      const { data, error } = await supabase
        .from('expert_accounts')  // FIXED: Changed from 'experts' to 'expert_accounts'
        .select('*')
        .eq('auth_id', authId)    // FIXED: Changed from 'id' to 'auth_id'
        .eq('status', 'approved') // FIXED: Only fetch approved experts
        .maybeSingle();

      if (error) {
        console.error('Error fetching expert by auth ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getExpertByAuthId:', error);
      return null;
    }
  },

  async updateExpert(expertId: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expert_accounts')  // FIXED: Use correct table name
        .update(updates)
        .eq('id', expertId);

      if (error) {
        console.error('Error updating expert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateExpert:', error);
      return false;
    }
  },

  async createExpert(expertData: Partial<ExpertProfile>): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')  // FIXED: Use correct table name
        .insert(expertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createExpert:', error);
      return null;
    }
  }
};
