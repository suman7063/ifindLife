
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/hooks/expert-auth/types';

export interface ExpertCreateData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
}

export class ExpertRepository {
  static async create(expertData: ExpertCreateData): Promise<ExpertProfile | null> {
    try {
      // Ensure required fields are present
      const insertData = {
        name: expertData.name,
        email: expertData.email,
        phone: expertData.phone || null,
        bio: expertData.bio || null,
        specialization: expertData.specialization || null,
        experience: expertData.experience || null,
        address: expertData.address || null,
        city: expertData.city || null,
        state: expertData.state || null,
        country: expertData.country || null,
        profile_picture: expertData.profile_picture || null,
        certificate_urls: expertData.certificate_urls || [],
        selected_services: expertData.selected_services || [],
        status: expertData.status || 'pending',
        average_rating: 0,
        reviews_count: 0,
        verified: false
      };

      const { data, error } = await supabase
        .from('experts')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return null;
      }

      // Convert to ExpertProfile format
      return {
        id: data.id,
        auth_id: '',
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specialties: [],
        experience_years: 0,
        hourly_rate: 0,
        status: data.status as 'pending' | 'approved' | 'disapproved',
        profilePicture: data.profile_picture,
        created_at: data.created_at,
        updated_at: data.created_at,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        certificate_urls: data.certificate_urls,
        selected_services: data.selected_services,
        average_rating: data.average_rating,
        reviews_count: data.reviews_count,
        verified: data.verified
      };
    } catch (error) {
      console.error('Error creating expert:', error);
      return null;
    }
  }

  static async findById(id: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        auth_id: '',
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specialties: [],
        experience_years: 0,
        hourly_rate: 0,
        status: data.status as 'pending' | 'approved' | 'disapproved',
        profilePicture: data.profile_picture,
        created_at: data.created_at,
        updated_at: data.created_at,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        certificate_urls: data.certificate_urls,
        selected_services: data.selected_services,
        average_rating: data.average_rating,
        reviews_count: data.reviews_count,
        verified: data.verified
      };
    } catch (error) {
      console.error('Error finding expert by ID:', error);
      return null;
    }
  }

  static async update(id: string, expertData: Partial<ExpertCreateData>): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('experts')
        .update(expertData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating expert:', error);
        return null;
      }

      return {
        id: data.id,
        auth_id: '',
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specialties: [],
        experience_years: 0,
        hourly_rate: 0,
        status: data.status as 'pending' | 'approved' | 'disapproved',
        profilePicture: data.profile_picture,
        created_at: data.created_at,
        updated_at: data.created_at,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        certificate_urls: data.certificate_urls,
        selected_services: data.selected_services,
        average_rating: data.average_rating,
        reviews_count: data.reviews_count,
        verified: data.verified
      };
    } catch (error) {
      console.error('Error updating expert:', error);
      return null;
    }
  }
}
