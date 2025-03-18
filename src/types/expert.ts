
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
  certificate_urls?: string[];
  profile_picture?: string;
  available?: boolean;
  average_rating?: number;
  reviews_count?: number;
  favorites?: string[];
}

export interface ExpertCardProps {
  expert: Expert;
}
