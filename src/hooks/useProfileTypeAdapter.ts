
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
    
    // Handle favorite_programs conversion from string[] to number[]
    const favoritePrograms = Array.isArray(profile.favorite_programs)
      ? profile.favorite_programs.map(id => {
          const numId = Number(id);
          return isNaN(numId) ? 0 : numId;
        })
      : [];
    
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
      avatar_url: profile.profile_picture,
      
      // Convert string[] to number[] for favorite_programs
      favorite_programs: favoritePrograms,
      favorite_experts: profile.favorite_experts?.map(id => id) || [],
      
      // Map additional properties
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      favoriteExperts: profile.favorite_experts,
      enrolledCourses: profile.enrolled_courses,
      referralCode: profile.referral_code,
      
      // Optional related data
      transactions: profile.transactions,
      reviews: profile.reviews,
      reports: profile.reports,
      referrals: profile.referrals
    };
  };

  /**
   * Convert UserProfileB to UserProfileA for function parameters that expect UserProfileA
   */
  const toTypeA = (profile: UserProfileB | null): UserProfileA | null => {
    if (!profile) return null;
    
    // Make sure all required fields have default values
    const name = profile.name || '';
    const email = profile.email || '';
    const phone = profile.phone || '';
    const country = profile.country || '';
    const city = profile.city || '';
    
    // Handle favorite_programs conversion from number[] to string[]
    const favoritePrograms = Array.isArray(profile.favorite_programs)
      ? profile.favorite_programs.map(id => String(id))
      : [];
    
    return {
      id: profile.id,
      name,
      email,
      phone,
      country,
      city,
      currency: profile.currency || 'USD',
      profile_picture: profile.profile_picture || profile.profilePicture || profile.avatar_url || '',
      wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
      created_at: profile.created_at || '',
      updated_at: profile.updated_at || '',
      referred_by: profile.referred_by || null,
      referral_code: profile.referral_code || profile.referralCode || '',
      referral_link: profile.referral_link || '',
      
      // Convert number[] to string[] for favorite_programs
      favorite_programs: favoritePrograms,
      favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
      enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
      
      // Add required fields that might be missing
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || []
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
      
      // Ensure profile is of type B by checking for presence of favoriteExperts property
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
      
      // Ensure profile is of type A by checking for presence of favorite_experts property
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
