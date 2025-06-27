
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  profile_picture: string;
  wallet_balance: number;
  created_at: string;
  referred_by: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: string[];
  favorite_programs: number[]; // Changed to only number[] for consistency
  enrolled_courses: any[];
  reviews: any[];
  reports: any[];
  transactions: any[];
  referrals: any[];
  recent_activities: any[]; // Added missing property
  upcoming_appointments: any[]; // Added missing property
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
