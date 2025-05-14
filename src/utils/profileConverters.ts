
import { AuthContextType } from '@/contexts/auth/AuthContext';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

// Convert user data from database to UserProfile
export function convertUserToUserProfile(userData: any): UserProfile | null {
  if (!userData) return null;
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    country: userData.country,
    city: userData.city,
    currency: userData.currency || 'USD',
    profile_picture: userData.profile_picture,
    wallet_balance: userData.wallet_balance || 0,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
    referred_by: userData.referred_by,
    referral_code: userData.referral_code,
    referral_link: userData.referral_link
  };
}

// This adapter helps components that use the old userProfile property
export function getUserProfile(auth: AuthContextType): UserProfile | null {
  return auth.profile;
}

// This adapter helps components that use the old updateUserProfile method
export function getUpdateUserProfile(auth: AuthContextType) {
  return auth.updateProfile;
}

// This helps with consistent access to user display name
export function getUserDisplayName(profile: UserProfile | null): string {
  if (!profile) return 'User';
  return profile.name || profile.email || 'User';
}

// This helps with consistent access to wallet balance
export function getWalletBalance(profile: UserProfile | null): number {
  if (!profile) return 0;
  return profile.wallet_balance || 0;
}
