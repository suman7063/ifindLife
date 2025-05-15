
import { ExpertProfile } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';

export class ExpertRepository {
  async getById(id: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.adaptExpertProfile(data);
    } catch (error) {
      console.error('Error fetching expert by id:', error);
      return null;
    }
  }

  async getByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) throw error;
      return this.adaptExpertProfile(data);
    } catch (error) {
      console.error('Error fetching expert by auth id:', error);
      return null;
    }
  }

  async getAll(): Promise<ExpertProfile[]> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.adaptExpertProfile);
    } catch (error) {
      console.error('Error fetching all experts:', error);
      return [];
    }
  }

  async update(id: string, profile: Partial<ExpertProfile>): Promise<boolean> {
    try {
      // Ensure experience is stored as a string in the database
      const dataToUpdate = {
        ...profile,
        experience: profile.experience !== undefined 
          ? String(profile.experience) 
          : undefined
      };

      const { error } = await supabase
        .from('expert_accounts')
        .update(dataToUpdate)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating expert:', error);
      return false;
    }
  }

  async create(profile: Omit<ExpertProfile, 'id'>): Promise<ExpertProfile | null> {
    try {
      // Ensure experience is stored as a string in the database
      const dataToInsert = {
        ...profile,
        experience: profile.experience !== undefined 
          ? String(profile.experience) 
          : undefined
      };

      const { data, error } = await supabase
        .from('expert_accounts')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;
      return this.adaptExpertProfile(data);
    } catch (error) {
      console.error('Error creating expert:', error);
      return null;
    }
  }

  // Helper method to adapt DB response to our ExpertProfile type
  private adaptExpertProfile(data: any): ExpertProfile {
    if (!data) return {} as ExpertProfile;
    
    // Convert experience to number if it can be parsed as a number
    let experience = data.experience;
    if (typeof experience === 'string') {
      const parsed = parseInt(experience, 10);
      if (!isNaN(parsed)) {
        experience = parsed;
      }
    }
    
    return {
      id: data.id,
      auth_id: data.auth_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      specialization: data.specialization,
      experience: experience,
      bio: data.bio,
      certificate_urls: data.certificate_urls,
      profile_picture: data.profile_picture,
      selected_services: data.selected_services,
      average_rating: data.average_rating,
      reviews_count: data.reviews_count,
      verified: data.verified,
      created_at: data.created_at,
      status: data.status
    };
  }
}

export const expertRepository = new ExpertRepository();
