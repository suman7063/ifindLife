
import { UserProfile } from '@/types/supabase';

// Function to convert database user to UserProfile
export const convertUserToUserProfile = (user: any): UserProfile => {
  if (!user) return {} as UserProfile;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency,
    profile_picture: user.profile_picture,
    wallet_balance: user.wallet_balance,
    created_at: user.created_at,
    referral_code: user.referral_code,
    referred_by: user.referred_by,
    referral_link: user.referral_link,
    favorite_experts: [],
    enrolled_courses: [],
    transactions: [],
    reviews: [],
    reports: [],
    referrals: []
  };
};
