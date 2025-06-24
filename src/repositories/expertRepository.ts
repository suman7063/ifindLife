
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export const expertRepository = {
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      console.log('Fetching expert profile for auth_id:', authId);
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching expert by auth ID:', error);
        return null;
      }

      if (!data) {
        console.log('No expert profile found for auth_id:', authId);
        return null;
      }

      console.log('Expert profile found:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in getExpertByAuthId:', error);
      return null;
    }
  },

  async updateExpert(expertId: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    try {
      console.log('Updating expert profile:', expertId, updates);
      
      // Clean up the updates object to match the new schema
      const cleanUpdates = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Remove any undefined values
      Object.keys(cleanUpdates).forEach(key => {
        if (cleanUpdates[key as keyof ExpertProfile] === undefined) {
          delete cleanUpdates[key as keyof ExpertProfile];
        }
      });

      const { error } = await supabase
        .from('expert_accounts')
        .update(cleanUpdates)
        .eq('id', expertId);

      if (error) {
        console.error('Error updating expert:', error);
        return false;
      }

      console.log('Expert profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateExpert:', error);
      return false;
    }
  },

  async createExpert(expertData: Partial<ExpertProfile>): Promise<ExpertProfile | null> {
    try {
      console.log('Creating expert profile:', expertData);
      
      // Prepare data for the new schema
      const insertData = {
        auth_id: expertData.auth_id,
        name: expertData.name || '',
        email: expertData.email || '',
        phone: expertData.phone || '',
        address: expertData.address || '',
        city: expertData.city || '',
        state: expertData.state || '',
        country: expertData.country || '',
        specialization: expertData.specialization || '',
        specialties: expertData.specialties || [],
        experience: expertData.experience || '',
        experience_years: expertData.experience_years || 0,
        bio: expertData.bio || '',
        certificate_urls: expertData.certificate_urls || [],
        certifications: expertData.certifications || [],
        profile_picture: expertData.profile_picture || '',
        profile_image_url: expertData.profile_image_url || '',
        selected_services: expertData.selected_services || [],
        hourly_rate: expertData.hourly_rate || 0,
        currency: expertData.currency || 'USD',
        timezone: expertData.timezone || '',
        availability_hours: expertData.availability_hours || {},
        languages: expertData.languages || ['English'],
        education: expertData.education || '',
        linkedin_url: expertData.linkedin_url || '',
        website_url: expertData.website_url || '',
        status: expertData.status || 'pending',
        verified: expertData.verified || false
      };

      const { data, error } = await supabase
        .from('expert_accounts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }

      console.log('Expert profile created successfully:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in createExpert:', error);
      return null;
    }
  },

  async getAllExperts(): Promise<ExpertProfile[]> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all experts:', error);
        return [];
      }

      return data as ExpertProfile[];
    } catch (error) {
      console.error('Error in getAllExperts:', error);
      return [];
    }
  }
};
