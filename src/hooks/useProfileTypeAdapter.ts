
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
      favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts.map(String) : [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || [],
      // Add camel case aliases for backward compatibility
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      favoriteExperts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts.map(String) : []
    };
  };

  const toTypeB = (profile: UserProfileA | UserProfile | null): UserProfileB | null => {
    if (!profile) return null;
    
    // Handle the different property name formats
    const getProfilePicture = (p: any) => {
      return p.profile_picture || p.profilePicture || '';
    };
    
    const getWalletBalance = (p: any) => {
      return p.wallet_balance || p.walletBalance || 0;
    };
    
    const getFavoriteExperts = (p: any) => {
      const experts = p.favorite_experts || p.favoriteExperts || [];
      return Array.isArray(experts) ? experts : [];
    };
    
    const getEnrolledCourses = (p: any) => {
      return p.enrolled_courses || p.enrolledCourses || [];
    };
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profile_picture: getProfilePicture(profile),
      wallet_balance: getWalletBalance(profile),
      created_at: profile.created_at,
      referred_by: profile.referred_by,
      referral_code: profile.referral_code,
      referral_link: profile.referral_link,
      favorite_experts: getFavoriteExperts(profile),
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: getEnrolledCourses(profile),
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || []
    };
  };

  return { toTypeA, toTypeB };
};
