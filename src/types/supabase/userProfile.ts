
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
  updated_at?: string;
  referred_by: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: string[];
  favorite_programs: number[] | string[];
  enrolled_courses: any[];
  reviews: any[]; // Made required to match expectations
  reports: any[]; // Made required to match expectations
  transactions: any[]; // Made required to match expectations
  referrals: any[]; // Made required to match expectations
  
  // Camel case aliases for backward compatibility
  profilePicture?: string;
  walletBalance?: number;
  favoriteExperts?: string[];
  enrolledCourses?: any[];
  referralCode?: string;
}
