
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export const expertRepository = {
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      console.log(`Fetching expert profile for auth ID: ${authId}`);
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        console.log('No expert profile found:', error.message);
        return null;
      }

      console.log('Expert profile found:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert:', error);
      return null;
    }
  },

  async getExpert(expertId: string): Promise<ExpertProfile | null> {
    try {
      console.log(`Fetching expert profile for ID: ${expertId}`);
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expertId)
        .single();

      if (error) {
        console.log('Expert profile not found:', error.message);
        return null;
      }

      console.log('Expert profile found:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert:', error);
      return null;
    }
  },

  async updateExpert(expertId: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      console.log(`Updating expert ${expertId} with:`, updates);
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', expertId);

      if (error) {
        console.error('Error updating expert:', error);
        return false;
      }

      console.log('Expert updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating expert:', error);
      return false;
    }
  },

  async createExpert(expertData: Partial<ExpertProfile>): Promise<ExpertProfile | null> {
    try {
      console.log('Creating expert with data:', expertData);
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .insert(expertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }

      console.log('Expert created successfully:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error creating expert:', error);
      return null;
    }
  }
};
