import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

export interface ExpertCreateData {
  auth_id: string; // Required: auth_id is now the primary key
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
  status?: 'pending' | 'approved' | 'rejected';
}

export class ExpertRepository {
  static async create(expertData: ExpertCreateData): Promise<ExpertProfile | null> {
    try {
      // Ensure required fields are present
      const insertData = {
        auth_id: expertData.auth_id, // Required: auth_id is now the primary key
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
        // selected_services removed - services are stored in expert_service_specializations table
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

      // If services were provided, save them to expert_service_specializations
      if (expertData.selected_services && expertData.selected_services.length > 0) {
        const specializations = expertData.selected_services.map((serviceId, index) => ({
          expert_id: data.auth_id,
          service_id: String(serviceId), // Database has UUID, but types expect number - using string
          is_available: true,
          is_primary_service: index === 0
        })) as unknown as Array<{ expert_id: string; service_id: number; is_available: boolean; is_primary_service: boolean }>; // Type assertion needed due to type mismatch (DB has UUID but types expect number)
        
        await supabase
          .from('expert_service_specializations')
          .insert(specializations);
      }

      // Convert to ExpertProfile format
      return {
        id: data.auth_id || '', // Use auth_id as id for backward compatibility
        auth_id: data.auth_id || '',
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
        selected_services: expertData.selected_services || [], // From input, now saved in expert_service_specializations
        average_rating: data.average_rating,
        reviews_count: data.reviews_count,
        verified: false
      };
    } catch (error) {
      console.error('Error creating expert:', error);
      return null;
    }
  }

  static async findById(authId: string): Promise<ExpertProfile | null> {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error || !data) {
        return null;
      }

      // Fetch services from expert_service_specializations
      const { data: servicesData } = await supabase
        .from('expert_service_specializations')
        .select('service_id')
        .eq('expert_id', authId)
        .eq('is_available', true);

      const selectedServices = servicesData?.map(s => Number(s.service_id)) || [];

      return {
        id: data.auth_id, // Use auth_id as id for backward compatibility
        auth_id: data.auth_id,
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
        selected_services: selectedServices, // From expert_service_specializations
        average_rating: data.average_rating,
        reviews_count: data.reviews_count,
        verified: false
      };
    } catch (error) {
      console.error('Error finding expert by auth ID:', error);
      return null;
    }
  }

  static async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    try {
      console.log(`🔍 Fetching expert by auth_id: ${authId}`);
      
      const { data, error } = await supabase
        .rpc('get_public_expert_profile', { p_auth_id: authId })
        .maybeSingle();

      if (error) {
        console.error('❌ RPC error fetching expert:', error);
        return null;
      }

      const expertData = data;
      
      if (!expertData) {
        console.log(`❌ No approved expert found with auth_id: ${authId}`);
        return null;
      }

      console.log(`✅ Found expert: ${expertData.name}`);
      
      // Transform to ExpertProfile format
      return {
        id: expertData.auth_id, // Use auth_id as id for backward compatibility
        auth_id: expertData.auth_id,
        name: expertData.name,
        email: expertData.email,
        phone: expertData.phone,
        bio: expertData.bio,
        specialties: [],
        experience_years: parseInt(expertData.experience) || 0,
        hourly_rate: 0,
        status: expertData.status as 'pending' | 'approved' | 'rejected',
        profilePicture: expertData.profile_picture,
        created_at: expertData.created_at,
        updated_at: expertData.created_at, // fallback
        address: expertData.address,
        city: expertData.city,
        state: expertData.state,
        country: expertData.country,
        specialization: expertData.specialization,
        experience: expertData.experience,
        certificate_urls: (expertData as { certificate_urls?: string[] }).certificate_urls || [],
        selected_services: expertData.selected_services || [],
        average_rating: expertData.average_rating,
        reviews_count: expertData.reviews_count,
        verified: expertData.verified
      };
    } catch (error) {
      console.error('Error finding expert by auth ID:', error);
      return null;
    }
  }

  static async update(authId: string, expertData: Partial<ExpertCreateData>): Promise<ExpertProfile | null> {
    try {
      // Extract selected_services if present (will be handled separately)
      const { selected_services, ...updateData } = expertData;
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .update(updateData)
        .eq('auth_id', authId)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating expert:', error);
        return null;
      }

      // If selected_services was provided, update expert_service_specializations
      if (selected_services !== undefined) {
        // Delete existing specializations
        await supabase
          .from('expert_service_specializations')
          .delete()
          .eq('expert_id', authId);
        
        // Insert new specializations
        if (selected_services.length > 0) {
          const specializations = selected_services.map((serviceId, index) => ({
            expert_id: authId,
            service_id: String(serviceId), // Database has UUID, but types expect number - using string
            is_available: true,
            is_primary_service: index === 0
          })) as unknown as Array<{ expert_id: string; service_id: number; is_available: boolean; is_primary_service: boolean }>; // Type assertion needed due to type mismatch (DB has UUID but types expect number)
          
          await supabase
            .from('expert_service_specializations')
            .insert(specializations);
        }
      }

      // Fetch services from expert_service_specializations for return value
      const { data: servicesData } = await supabase
        .from('expert_service_specializations')
        .select('service_id')
        .eq('expert_id', authId)
        .eq('is_available', true);

      // Convert UUID strings to numbers for backward compatibility with types
      const selectedServices = servicesData?.map(s => {
        // If service_id is UUID string, we'll return it as-is since types expect number[]
        // This is a type mismatch - database has UUID but types expect number
        return s.service_id;
      }).filter(Boolean) || [];

      return {
        id: data.auth_id, // Use auth_id as id for backward compatibility
        auth_id: data.auth_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specialties: [],
        experience_years: 0,
        hourly_rate: 0,
        status: 'pending',
        profile_picture: data.profile_picture,
        profilePicture: data.profile_picture, // For backward compatibility
        created_at: data.created_at,
        updated_at: data.created_at,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        certificate_urls: data.certificate_urls,
        selected_services: selectedServices as unknown as number[], // From expert_service_specializations - UUID strings but types expect number[]
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
