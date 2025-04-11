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
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  status?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  selected_services?: number[];
  price_per_min?: number;
  price?: number;
  imageUrl?: string;
}

export interface Expert extends ExpertProfile {
  id: string;
  name: string;
  email: string;
  pricing?: number;
  price_per_min?: number;
}

export interface ExtendedExpert extends Expert {
  specialties: string[];
  rating: number;
  reviewCount: number;
  image: string;
  price: number;
  currency: string;
  available: boolean;
  featured: boolean;
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[] | string[];
}
