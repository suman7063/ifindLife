
export interface Expert {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  profile_picture?: string;
  avatar_url?: string;
  imageUrl?: string;
  certificate_urls?: string[];
  created_at?: string;
  status?: 'pending' | 'approved' | 'rejected';
  verified?: boolean;
  average_rating?: number;
  reviews_count?: number;
  selected_services?: number[];
  price_per_min?: number;
}

export interface ExtendedExpert extends Expert {
  pricing?: number;
  online?: boolean;
  languages?: string[];
  availability?: string;
  waitTime?: string;
  consultations?: number;
  rating?: number;
  price?: number;
}
