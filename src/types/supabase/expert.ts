
// Expert-related type definitions

export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  auth_id?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

export interface ExpertReview {
  id: string;
  expert_id: string | number;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_name?: string;
}

export interface ExpertService {
  id: number;
  expert_id: string;
  service_id: number;
  rate?: number;
  name?: string;
  description?: string;
}

export interface ExpertAvailability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: string;
  created_at?: string;
}
