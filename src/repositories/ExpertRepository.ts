
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export class ExpertRepository {
  /**
   * Get an expert by ID
   */
  async getExpertById(id: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching expert by ID:', error);
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
      
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching expert by auth ID:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Repository error in getExpertByAuthId:', error);
      return null;
    }
  }

  /**
   * Update an expert's profile
   */
  async updateExpert(id: string, updates: Partial<ExpertProfile>): Promise<boolean> {
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
   * Get all experts
   */
  async getAllExperts(): Promise<ExpertProfile[]> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('status', 'approved');
      
      if (error) {
        console.error('Error fetching experts:', error);
        return [];
      }
      
      return data as ExpertProfile[];
    } catch (error) {
      console.error('Repository error in getAllExperts:', error);
      return [];
    }
  }

  /**
   * Create a new expert
   */
  async createExpert(expertData: Omit<ExpertProfile, 'id'>): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .insert([expertData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Repository error in createExpert:', error);
      return null;
    }
  }
}

export const expertRepository = new ExpertRepository();
