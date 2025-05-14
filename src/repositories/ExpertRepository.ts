
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

class ExpertRepository {
  /**
   * Get an expert by ID
   */
  async getExpertById(id: string | number): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Repository error in getExpertById:', error);
      return null;
    }
  }
  
  /**
   * Get an expert by auth ID
   */
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
        console.error('Error fetching expert by auth ID:', error);
        return null;
      }
      
      return data as ExpertProfile || null;
    } catch (error) {
      console.error('Repository error in getExpertByAuthId:', error);
      return null;
    }
  }
  
  /**
   * Update an expert's profile
   */
  async updateExpert(id: string | number, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Repository error in updateExpert:', error);
      return false;
    }
  }
  
  /**
   * Get an expert by email
   */
  async getExpertByEmail(email: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Error fetching expert by email:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Repository error in getExpertByEmail:', error);
      return null;
    }
  }
}

export const expertRepository = new ExpertRepository();
