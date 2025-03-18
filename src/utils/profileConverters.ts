
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
    profilePicture: user.profile_picture,
    walletBalance: user.wallet_balance,
    createdAt: user.created_at,
    referralCode: user.referral_code,
    referredBy: user.referred_by,
    referralLink: user.referral_link,
    favoriteExperts: [],
    enrolledCourses: [],
    transactions: [],
    reviews: [],
    reports: [],
    referrals: []
  };
};
