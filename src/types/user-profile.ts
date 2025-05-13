
// Unified UserProfile interface to handle all variations across the app
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  
  // Different naming conventions for profile picture
  profile_picture?: string;
  profilePicture?: string;
  avatar_url?: string;
  
  // Wallet properties
  wallet_balance?: number;
  walletBalance?: number;
  currency?: string;
  
  // Referral properties
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
  
  // Collection properties
  favorite_experts?: string[] | number[];
  favorite_programs?: number[];
  favorites?: number[];
  enrolled_courses?: any[];
  enrolledCourses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Helper methods for property access compatibility
  getProfilePicture?: () => string | undefined;
  getWalletBalance?: () => number;
}

// Helper function to normalize a user profile to ensure all properties are accessible
// regardless of the naming convention used
export function normalizeUserProfile(profile: any): UserProfile {
  if (!profile) return {} as UserProfile;
  
  return {
    ...profile,
    // Ensure profile picture is accessible through both naming conventions
    profile_picture: profile.profile_picture || profile.profilePicture || profile.avatar_url,
    profilePicture: profile.profile_picture || profile.profilePicture || profile.avatar_url,
    avatar_url: profile.profile_picture || profile.profilePicture || profile.avatar_url,
    
    // Ensure wallet balance is accessible through both naming conventions
    wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
    walletBalance: profile.wallet_balance || profile.walletBalance || 0,
    
    // Ensure collections are always arrays
    favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts : 
                      (Array.isArray(profile.favorites) ? profile.favorites : []),
    favorites: Array.isArray(profile.favorites) ? profile.favorites : 
              (Array.isArray(profile.favorite_experts) ? profile.favorite_experts : []),
    favorite_programs: Array.isArray(profile.favorite_programs) ? profile.favorite_programs : [],
    enrolled_courses: Array.isArray(profile.enrolled_courses) ? profile.enrolled_courses : 
                     (Array.isArray(profile.enrolledCourses) ? profile.enrolledCourses : []),
    enrolledCourses: Array.isArray(profile.enrolledCourses) ? profile.enrolledCourses : 
                    (Array.isArray(profile.enrolled_courses) ? profile.enrolled_courses : []),
    
    // Helper methods
    getProfilePicture: () => profile.profile_picture || profile.profilePicture || profile.avatar_url,
    getWalletBalance: () => profile.wallet_balance || profile.walletBalance || 0
  };
}
