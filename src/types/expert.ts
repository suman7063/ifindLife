
export interface Expert {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profilePicture?: string;
  certificate_urls?: string[];
  average_rating?: number;
  reviews_count?: number;
  selected_services?: number[];
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
}
