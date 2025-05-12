
import { UserProfile } from '@/contexts/auth/types';
import { AuthContextType } from '@/contexts/auth/AuthContext';

/**
 * Converts a database user record to the UserProfile interface
 */
export function convertUserToUserProfile(data: any): UserProfile {
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    country: data.country || '',
    city: data.city || '',
    avatar_url: data.profile_picture || data.avatar_url || '',
    currency: data.currency || 'USD',
    wallet_balance: data.wallet_balance || 0,
    referral_code: data.referral_code || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
}

/**
 * Creates a minimal user profile from basic data
 */
export function createMinimalUserProfile(id: string, email: string, name?: string): UserProfile {
  return {
    id,
    name: name || email.split('@')[0] || '',
    email,
    currency: 'USD',
    wallet_balance: 0
  };
}

/**
 * This adapter helps components that use the old userProfile property
 */
export function getUserProfile(auth: AuthContextType) {
  return auth.profile;
}

/**
 * This adapter helps components that use the old updateUserProfile method
 */
export function getUpdateUserProfile(auth: AuthContextType) {
  return auth.updateProfile;
}
