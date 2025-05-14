
import { UserTransaction } from './tables';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
  
  // Related data
  transactions?: UserTransaction[];
  reviews?: any[];
  reports?: any[];
  favorite_experts?: string[];
  favorite_programs?: number[]; // Add this property
  enrolled_courses?: any[];
  referrals?: any[];
  
  // TypeScript doesn't allow interface methods with implementation in .ts files
  // So let's define these as optional properties
  profilePicture?: string;
  walletBalance?: number;
  favoriteExperts?: string[];
  enrolledCourses?: any[];
  referralCode?: string;
}

// Export aliases for camelCase access
export function getProfilePicture(profile: UserProfile): string | undefined {
  return profile.profile_picture;
}

export function getWalletBalance(profile: UserProfile): number | undefined {
  return profile.wallet_balance;
}

export function getFavoriteExperts(profile: UserProfile): string[] | undefined {
  return profile.favorite_experts;
}

export function getEnrolledCourses(profile: UserProfile): any[] | undefined {
  return profile.enrolled_courses;
}

export function getReferralCode(profile: UserProfile): string | undefined {
  return profile.referral_code;
}
