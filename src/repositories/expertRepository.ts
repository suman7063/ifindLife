import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

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
        average_rating: 0,
        reviews_count: 0
      };

      const { data, error } = await supabase
        .from('expert_accounts')
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
        status: 'pending',
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
        verified: false
      };
    } catch (error) {
      console.error('Error creating expert:', error);
      return null;
    }
  }

  static async findById(id: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
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
        status: 'pending',
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
        verified: false
      };
    } catch (error) {
      console.error('Error finding expert by ID:', error);
      return null;
    }
  }

  static async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      console.log(`🔍 Fetching expert by auth_id: ${authId}`);
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .limit(1);

      if (error) {
        console.error('❌ Database error fetching expert:', error);
        return null;
      }

      const expertData = Array.isArray(data) ? data[0] : data;
      
      if (!expertData) {
        console.log(`❌ No expert found with auth_id: ${authId}`);
        return null;
      }

      console.log(`✅ Found expert: ${expertData.name}`);
      
      // Transform to ExpertProfile format
      return {
        id: expertData.id,
        auth_id: expertData.auth_id,
        name: expertData.name,
        email: expertData.email,
        phone: expertData.phone,
        bio: expertData.bio,
        specialties: [],
        experience_years: parseInt(expertData.experience) || 0,
        hourly_rate: 0,
        status: expertData.status as 'pending' | 'approved' | 'disapproved',
        profilePicture: expertData.profile_picture,
        created_at: expertData.created_at,
        updated_at: expertData.created_at, // Use created_at as fallback since updated_at may not exist
        address: expertData.address,
        city: expertData.city,
        state: expertData.state,
        country: expertData.country,
        specialization: expertData.specialization,
        experience: expertData.experience,
        certificate_urls: expertData.certificate_urls,
        selected_services: expertData.selected_services,
        average_rating: expertData.average_rating,
        reviews_count: expertData.reviews_count,
        verified: expertData.verified
      };
    } catch (error) {
      console.error('Error finding expert by auth ID:', error);
      return null;
    }
  }

  static async update(id: string, expertData: Partial<ExpertCreateData>): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
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
        status: 'pending',
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
        verified: false
      };
    } catch (error) {
      console.error('Error updating expert:', error);
      return null;
    }
  }

  // Instance method that calls the static method for compatibility
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    return ExpertRepository.getExpertByAuthId(authId);
  }
}
