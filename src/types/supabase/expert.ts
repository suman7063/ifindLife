
export interface ExpertProfile {
  id: string | number;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  services?: string[] | number[];
  experience_years?: number;
  rate_per_hour?: number;
  availability?: any[];
  profile_picture?: string;
  address?: string;
  city?: string;
  country?: string;
  qualifications?: string[];
  status?: 'pending' | 'approved' | 'rejected' | 'active';
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;
  languages?: string[];
  is_online?: boolean;
  last_active?: string;
}
