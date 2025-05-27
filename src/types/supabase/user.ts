
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit' | string;
  currency: string;
  description?: string;
  transaction_type?: string; // Added for backward compatibility
  created_at?: string; // Added for backward compatibility
}

export interface Review {
  id: string;
  expert_id: number | string; // Updated to allow both types
  rating: number;
  date: string;
  comment?: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
  review_id?: string; // For backward compatibility
}

export interface Report {
  id: string;
  expert_id: number | string; // Updated to allow both types
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface Course {
  id: string;
  title: string;
  expert_name: string;
  progress: number;
  completed: boolean;
  enrollment_date: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_claimed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  profile_picture: string | null;
  wallet_balance: number;
  created_at: string;
  referred_by: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: string[] | number[];  // Updated to match unified type
  favorite_programs: string[] | number[]; // Updated to match unified type
  enrolled_courses: Course[];
  reviews: Review[]; // Made required to match expectations
  reports: Report[]; // Made required to match expectations
  transactions: UserTransaction[]; // Made required to match expectations
  referrals: Referral[]; // Made required to match expectations
  // Add these for improved type compatibility
  profilePicture?: string | null;
  walletBalance?: number;
  favoriteExperts?: string[] | number[];
}
