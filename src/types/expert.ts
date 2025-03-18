
export interface Expert {
  id: number | string;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string;
  wait_time?: string; // Adding for backwards compatibility
  imageUrl: string;
  image_url?: string; // Adding for backwards compatibility
  online?: boolean;
  languages: string[];
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  certificate_urls?: string[];
  created_at?: string;
  profile_picture?: string;
  email?: string;
  phone?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
}
