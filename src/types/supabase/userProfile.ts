
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
  enrolled_courses?: any[];
  referrals?: any[];
  
  // Aliases for camelCase access
  get profilePicture(): string | undefined {
    return this.profile_picture;
  }
  
  get walletBalance(): number | undefined {
    return this.wallet_balance;
  }
  
  get favoriteExperts(): string[] | undefined {
    return this.favorite_experts;
  }
  
  get enrolledCourses(): any[] | undefined {
    return this.enrolled_courses;
  }
  
  get referralCode(): string | undefined {
    return this.referral_code;
  }
}
