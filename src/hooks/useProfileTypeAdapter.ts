
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

export const useProfileTypeAdapter = () => {
  const toTypeA = (profile: UserProfile | UserProfileB | null): UserProfileA | null => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profile_picture: profile.profile_picture,
      wallet_balance: profile.wallet_balance,
      created_at: profile.created_at,
      referred_by: profile.referred_by,
      referral_code: profile.referral_code,
      referral_link: profile.referral_link,
      favorite_experts: profile.favorite_experts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || [],
      // Add camel case aliases for backward compatibility
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      favoriteExperts: profile.favorite_experts || []
    };
  };

  const toTypeB = (profile: UserProfileA | UserProfile | null): UserProfileB | null => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profile_picture: 'profile_picture' in profile ? profile.profile_picture : profile.profilePicture,
      wallet_balance: 'wallet_balance' in profile ? profile.wallet_balance : profile.walletBalance,
      created_at: profile.created_at,
      referred_by: profile.referred_by,
      referral_code: profile.referral_code,
      referral_link: profile.referral_link,
      favorite_experts: 'favorite_experts' in profile ? profile.favorite_experts : profile.favoriteExperts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: 'enrolled_courses' in profile ? profile.enrolled_courses : profile.enrolledCourses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || []
    };
  };

  return { toTypeA, toTypeB };
};
