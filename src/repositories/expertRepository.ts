
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export interface ExpertRepository {
  getAll(): Promise<ExpertProfile[]>;
  getById(id: string): Promise<ExpertProfile | null>;
  getByAuthId(authId: string): Promise<ExpertProfile | null>;
  updateExpert(id: string, updates: Partial<ExpertProfile>): Promise<boolean>;
}

export const expertRepository: ExpertRepository = {
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
  },
  
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
  },
  
  async getByAuthId(authId: string): Promise<ExpertProfile | null> {
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
  },
  
  async updateExpert(id: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      // Convert number experience to string if needed
      const updatesWithFormattedExperience = {
        ...updates,
        experience: updates.experience !== undefined 
          ? String(updates.experience) 
          : undefined
      };
      
      const { error } = await supabase
        .from('experts')
        .update(updatesWithFormattedExperience)
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating expert with id ${id}:`, error);
      return false;
    }
  }
};
