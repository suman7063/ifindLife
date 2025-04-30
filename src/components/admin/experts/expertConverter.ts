
import { Expert } from './types';
import { supabase } from '@/lib/supabase';

export interface SupabaseExpertData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  average_rating?: number;
  reviews_count?: number;
  created_at?: string;
}

/**
 * Converts Supabase expert data to the Expert format used in admin components
 */
export function convertToAdminExpertFormat(expertData: SupabaseExpertData[]): Expert[] {
  return expertData.map(expert => ({
    id: parseInt(expert.id) || Math.floor(Math.random() * 10000), // Convert string ID to number or generate a random one
    name: expert.name,
    experience: typeof expert.experience === 'string' ? parseInt(expert.experience) || 1 : 1,
    specialties: expert.specialization ? [expert.specialization] : [],
    rating: expert.average_rating || 4,
    consultations: expert.reviews_count || 0,
    price: 30, // Default price
    waitTime: "Available",
    imageUrl: expert.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    online: true,
    languages: [],
    bio: expert.bio || '',
    email: expert.email,
    phone: expert.phone || '',
    address: expert.address || '',
    city: expert.city || '',
    state: expert.state || '',
    country: expert.country || ''
  }));
}

/**
 * Fetches experts from Supabase and converts them to the admin Expert format
 */
export async function fetchAndConvertExperts(): Promise<Expert[]> {
  try {
    const { data: expertsData, error } = await supabase
      .from('experts')
      .select('*');
    
    if (error) {
      console.error('Error fetching experts:', error);
      return [];
    }
    
    return convertToAdminExpertFormat(expertsData || []);
  } catch (error) {
    console.error('Error in fetchAndConvertExperts:', error);
    return [];
  }
}
