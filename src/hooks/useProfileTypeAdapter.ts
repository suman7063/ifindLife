
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

export const useProfileTypeAdapter = () => {
  const adaptUserProfile = (data: any): UserProfile => {
    if (!data) return {} as UserProfile;
    
    const profile: UserProfile = {
      id: data.id || '',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      country: data.country || '',
      profile_picture: data.profile_picture || '',
      wallet_balance: data.wallet_balance || 0,
      currency: data.currency || 'USD',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || data.created_at || new Date().toISOString(),
      referral_code: data.referral_code || '',
      referral_link: data.referral_link || '',
      referred_by: data.referred_by || null,
      
      // Collections with empty defaults
      transactions: data.transactions || [],
      reviews: data.reviews || [],
      reports: data.reports || [],
      favorite_experts: data.favorite_experts || [],
      favorite_programs: data.favorite_programs || [],
      enrolled_courses: data.enrolled_courses || [],
      referrals: data.referrals || [],
      
      // Aliases for camelCase access
      profilePicture: data.profile_picture || data.profilePicture || '',
      walletBalance: data.wallet_balance || data.walletBalance || 0,
      favoriteExperts: data.favorite_experts || data.favoriteExperts || [],
      referralCode: data.referral_code || data.referralCode || '',
    };
    
    return profile;
  };
  
  // Type conversion helpers from one schema to another
  const toTypeA = (profileB: UserProfileB | any): UserProfileA => {
    if (!profileB) return {} as UserProfileA;
    
    return {
      id: profileB.id || '',
      name: profileB.name || '',
      email: profileB.email || '',
      phone: profileB.phone || '',
      country: profileB.country || '',
      city: profileB.city || '',
      currency: profileB.currency || 'USD',
      profile_picture: profileB.profilePicture || profileB.profile_picture || '',
      wallet_balance: profileB.walletBalance || profileB.wallet_balance || 0,
      created_at: profileB.created_at || profileB.createdAt || new Date().toISOString(),
      referred_by: profileB.referred_by || profileB.referredBy || null,
      referral_code: profileB.referralCode || profileB.referral_code || '',
      referral_link: profileB.referral_link || profileB.referralLink || '',
      favorite_experts: Array.isArray(profileB.favoriteExperts) 
        ? profileB.favoriteExperts 
        : (Array.isArray(profileB.favorite_experts) ? profileB.favorite_experts : []),
      favorite_programs: Array.isArray(profileB.favoritePrograms) 
        ? profileB.favoritePrograms.map(String) 
        : (Array.isArray(profileB.favorite_programs) ? profileB.favorite_programs.map(String) : []),
      enrolled_courses: profileB.enrolledCourses || profileB.enrolled_courses || [],
      reviews: profileB.reviews || [],
      reports: profileB.reports || [],
      transactions: profileB.transactions || [],
      referrals: profileB.referrals || []
    };
  };
  
  const toTypeB = (profileA: UserProfileA | any): UserProfileB => {
    if (!profileA) return {} as UserProfileB;
    
    return {
      id: profileA.id || '',
      name: profileA.name || '',
      email: profileA.email || '',
      phone: profileA.phone || '',
      country: profileA.country || '',
      city: profileA.city || '',
      currency: profileA.currency || 'USD',
      profilePicture: profileA.profile_picture || '',
      walletBalance: profileA.wallet_balance || 0,
      created_at: profileA.created_at || new Date().toISOString(),
      referred_by: profileA.referred_by || null,
      referralCode: profileA.referral_code || '',
      referral_link: profileA.referral_link || '',
      favoriteExperts: Array.isArray(profileA.favorite_experts) ? profileA.favorite_experts : [],
      // Fixed - use favorite_programs instead of favoritePrograms
      favorite_programs: Array.isArray(profileA.favorite_programs) 
        ? profileA.favorite_programs.map(Number) 
        : [],
      enrolledCourses: profileA.enrolled_courses || [],
      reviews: profileA.reviews || [],
      reports: profileA.reports || [],
      transactions: profileA.transactions || [],
      referrals: profileA.referrals || []
    };
  };
  
  return {
    adaptUserProfile,
    toTypeA,
    toTypeB
  };
};
