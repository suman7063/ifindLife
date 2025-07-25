
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  profile_picture: string;
  reward_points?: number;
  created_at: string;
  updated_at?: string;
  referred_by: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: string[];
  favorite_programs: number[];
  enrolled_courses: any[];
  reviews: any[];
  reports: any[];
  transactions: any[];
  reward_transactions?: RewardTransaction[];
  referrals: any[];
  recent_activities: any[];
  upcoming_appointments: any[];
  
  // Camel case aliases for backward compatibility
  profilePicture?: string;
  rewardPoints?: number;
  favoriteExperts?: string[];
  enrolledCourses?: any[];
  referralCode?: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  date: string;
  type: string;
  points: number;
  description?: string;
  created_at: string;
}
