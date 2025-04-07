
// Expert profile type for Supabase

export interface ExpertProfile {
  id: string | number;
  auth_id?: string;
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
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Export types related to expert reviews
export interface ExpertReview {
  id: string | number;
  expert_id: string | number;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Export types related to expert services
export interface ExpertService {
  id: number;
  expert_id: string | number;
  service_id: number;
  price?: number;
  is_available: boolean;
}

// Export types for expert availability
export interface ExpertAvailability {
  id: string | number;
  expert_id: string | number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}
