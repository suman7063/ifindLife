
import { UserProfile } from '@/contexts/auth/types';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { ensureStringIdArray } from './idConverters';

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
    updated_at: data.updated_at || '',
    // Convert arrays to ensure consistent types
    favorite_experts: ensureStringIdArray(data.favorite_experts || []),
    enrolled_courses: data.enrolled_courses || [],
    reviews: data.reviews || [],
    reports: data.reports || [],
    transactions: data.transactions || [],
    referrals: data.referrals || [],
    profile_picture: data.profile_picture || ''
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
    wallet_balance: 0,
    favorite_experts: [], // Initialize as empty string array
    enrolled_courses: [],
    reviews: [],
    reports: [],
    transactions: [],
    referrals: []
  };
}

/**
 * This adapter helps components that use the old userProfile property
 */
export function getUserProfile(auth: typeof AuthContext.Provider) {
  return auth.props.value?.profile;
}

/**
 * This adapter helps components that use the old updateUserProfile method
 */
export function getUpdateUserProfile(auth: typeof AuthContext.Provider) {
  return auth.props.value?.updateProfile;
}
