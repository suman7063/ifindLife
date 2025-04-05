
export interface Expert {
  id: number | string;
  name: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  specialization?: string;
  experience?: number;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  pricing?: {
    price_per_min?: number;
    consultation_fee?: number;
  };
}
