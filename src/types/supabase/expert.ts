
// Expert profile type for Supabase

export interface ExpertProfile {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string; // Keep as string consistently
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'rejected'; // Use union type instead of string
  created_at?: string;
  updated_at?: string;
  languages?: string[]; // Add languages field
  category?: string; // Add category field
}

// Export types related to expert reviews
export interface ExpertReview {
  id: string;
  expert_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Export types related to expert services
export interface ExpertService {
  id: number;
  expert_id: string;
  service_id: number;
  price?: number;
  is_available: boolean;
}

// Export types for expert availability
export interface ExpertAvailability {
  id: string;
  expert_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  day?: string; // Adding day property to fix error
}
