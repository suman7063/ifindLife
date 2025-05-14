
import { AuthContextType } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/database/unified';

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
