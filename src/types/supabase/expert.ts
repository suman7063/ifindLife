
export interface ExpertProfile {
  id: string; // Changed from string | number to just string
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  rating?: number;
  total_reviews?: number;
  price_per_min?: number; // Added this field
  price?: number;
  avatar_url?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
  imageUrl?: string; // Added this field for compatibility
}

export interface ExpertRegistrationData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: (string | number)[];
}
