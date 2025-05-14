
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Hook to handle UserProfile type compatibility issues
 */
export const useProfileTypeAdapter = () => {
  /**
   * Convert UserProfileA to UserProfileB for function parameters that expect UserProfileB
   */
  const toTypeB = (profile: UserProfileA | null): UserProfileB | null => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      country: profile.country,
      profile_picture: profile.profile_picture,
      wallet_balance: profile.wallet_balance,
      currency: profile.currency,
      created_at: profile.created_at,
      updated_at: profile.updated_at || profile.created_at,
      referral_code: profile.referral_code,
      referral_link: profile.referral_link,
      referred_by: profile.referred_by,
      
      // Convert string[] to number[] for favorite_programs
      favorite_programs: profile.favorite_programs?.map(id => Number(id)) || [],
      
      // Map additional properties
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      favoriteExperts: profile.favorite_experts,
      enrolledCourses: profile.enrolled_courses,
      referralCode: profile.referral_code,
    };
  };

  /**
   * Convert UserProfileB to UserProfileA for function parameters that expect UserProfileA
   */
  const toTypeA = (profile: UserProfileB | null): UserProfileA | null => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      country: profile.country || '',
      city: profile.city || '',
      currency: profile.currency || 'USD',
      profile_picture: profile.profile_picture || profile.profilePicture || '',
      wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
      created_at: profile.created_at || '',
      referred_by: profile.referred_by || null,
      referral_code: profile.referral_code || profile.referralCode || '',
      referral_link: profile.referral_link || '',
      
      // Convert number[] to string[] for favorite_programs
      favorite_programs: profile.favorite_programs?.map(id => String(id)) || [],
      favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
      enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
      
      // Add required fields that might be missing
      reviews: [],
      reports: [],
      transactions: [],
      referrals: []
    };
  };

  /**
   * Function to wrap API calls that require UserProfileB as input
   */
  const withTypeB = <T extends unknown[], R>(
    fn: (profile: UserProfileB, ...args: T) => R
  ) => {
    return (profile: UserProfileA | UserProfileB | null, ...args: T): R | null => {
      if (!profile) return null;
      
      // Ensure profile is of type B
      const profileB = 'favoriteExperts' in profile 
        ? profile as UserProfileB 
        : toTypeB(profile as UserProfileA);
      
      if (!profileB) return null;
      
      return fn(profileB, ...args);
    };
  };

  /**
   * Function to wrap API calls that require UserProfileA as input
   */
  const withTypeA = <T extends unknown[], R>(
    fn: (profile: UserProfileA, ...args: T) => R
  ) => {
    return (profile: UserProfileA | UserProfileB | null, ...args: T): R | null => {
      if (!profile) return null;
      
      // Ensure profile is of type A
      const profileA = 'favorite_experts' in profile
        ? profile as UserProfileA
        : toTypeA(profile as UserProfileB);
      
      if (!profileA) return null;
      
      return fn(profileA, ...args);
    };
  };

  return {
    toTypeA,
    toTypeB,
    withTypeA,
    withTypeB
  };
};
