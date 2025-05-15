
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export class ExpertRepository {
  async getAll(): Promise<ExpertProfile[]> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*');
      
      if (error) throw error;
      return data as ExpertProfile[];
    } catch (error) {
      console.error('Error fetching experts:', error);
      return [];
    }
  }
  
  async getById(id: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ExpertProfile;
    } catch (error) {
      console.error(`Error fetching expert with id ${id}:`, error);
      return null;
    }
  }
  
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .single();
      
      if (error) throw error;
      return data as unknown as ExpertProfile;
    } catch (error) {
      console.error(`Error fetching expert with auth_id ${authId}:`, error);
      return null;
    }
  }
  
  async updateExpert(id: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      // Convert number experience to string if needed
      const updatesWithStringExperience = {
        ...updates,
        experience: updates.experience !== undefined ? String(updates.experience) : undefined
      };
      
      const { error } = await supabase
        .from('experts')
        .update(updatesWithStringExperience)
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating expert with id ${id}:`, error);
      return false;
    }
  }
}

export const expertRepository = new ExpertRepository();
