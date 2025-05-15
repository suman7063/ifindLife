
export interface Service {
  id: number;
  name: string;
  description?: string;
  rate_usd: number;
  rate_inr: number;
  image_url?: string;
  category?: string;
  duration?: number;
  featured?: boolean;
}

export interface ServiceWithExperts extends Service {
  experts?: Expert[];
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  specialization?: string;
  bio?: string;
  experience?: string;
  average_rating?: number;
  reviews_count?: number;
  selectedServices?: number[];
  selected_services?: number[];
}
