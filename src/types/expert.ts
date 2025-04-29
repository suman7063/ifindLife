
export interface Expert {
  id: string; // Changed to string only
  name: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  specialization?: string;
  experience?: string | number;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;  // Added this property
  pricing?: {
    price_per_min?: number;
    consultation_fee?: number;
  };
}

// Add the missing ExtendedExpert type
export interface ExtendedExpert extends Expert {
  distance?: number;
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  sessionCount?: number;
  availability?: any[];
  specialties?: string[];
  languages?: string[];
}
