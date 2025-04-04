
export interface Expert {
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
  profile_picture?: string;
  certificate_urls?: string[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  auth_id?: string;
  selected_services?: number[];
}

export type { Expert as ExpertProfile };
