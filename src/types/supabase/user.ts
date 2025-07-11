
export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  currency: string | null;
  profile_picture: string | null;
  wallet_balance: number | null;
  created_at: string | null;
  referred_by: string | null;
  referral_code: string | null;
  referral_link: string | null;
  
  // New fields from updated schema
  date_of_birth: string | null;
  gender: string | null;
  occupation: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  preferences: any;
  terms_accepted: boolean | null;
  privacy_accepted: boolean | null;
  marketing_consent: boolean | null;
  
  // Optional extended data (populated via joins or separate queries)
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
  recent_activities?: any[];
  upcoming_appointments?: any[];
}

// Add missing type exports
export interface Review {
  id: string;
  expert_id: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Report {
  id: string;
  expert_id: string;
  reason: string;
  details: string;
  date: string;
  status: string;
}

export interface Course {
  id: string;
  title: string;
  expert_name: string;
  enrollment_date: string;
  progress: number;
  completed: boolean;
}
