
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export const expertRepository = {
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      console.log('🔒 expertRepository: Fetching expert by auth ID:', authId);
      
      // ✅ FIXED: Use correct table name and column
      const { data, error } = await supabase
        .from('expert_accounts')  // ✅ Correct table name
        .select('*')
        .eq('auth_id', authId)    // ✅ Correct column name
        .eq('status', 'approved') // ✅ Only approved experts
        .maybeSingle();          // ✅ Use maybeSingle to avoid errors when not found

      if (error) {
        console.error('🔒 expertRepository: Error fetching expert by auth ID:', error);
        return null;
      }

      if (!data) {
        console.log('🔒 expertRepository: No approved expert found for auth ID:', authId);
        return null;
      }

      console.log('🔒 expertRepository: Expert found:', data.name);
      return data;
    } catch (error) {
      console.error('🔒 expertRepository: Error in getExpertByAuthId:', error);
      return null;
    }
  },

  async updateExpert(expertId: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expert_accounts')  // ✅ Correct table name
        .update(updates)
        .eq('id', expertId);

      if (error) {
        console.error('🔒 expertRepository: Error updating expert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('🔒 expertRepository: Error in updateExpert:', error);
      return false;
    }
  },

  async createExpert(expertData: Partial<ExpertProfile>): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')  // ✅ Correct table name
        .insert(expertData)
        .select()
        .single();

      if (error) {
        console.error('🔒 expertRepository: Error creating expert:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('🔒 expertRepository: Error in createExpert:', error);
      return null;
    }
  }
};
