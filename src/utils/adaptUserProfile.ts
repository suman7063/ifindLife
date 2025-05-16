
import { UserProfile } from '@/types/supabase/user';

/**
 * Adapts different user profile formats to ensure consistent access to profile properties
 * This helps handle cases where the user object might come from different sources
 */
export function adaptUserProfile(user: any): UserProfile {
  if (!user) return {
    id: '',
    name: 'User',
    email: '',
    auth_id: '',
    profile_picture: '',
    wallet_balance: 0,
  };
  
  return {
    id: user.id || user.auth_id || '',
    name: user.name || user.displayName || user.username || '',
    email: user.email || '',
    auth_id: user.auth_id || user.id || '',
    profile_picture: user.profile_picture || user.avatar || '',
    wallet_balance: user.wallet_balance || 0,
    currency: user.currency || '$',
    ...user // Keep any additional properties
  };
}
