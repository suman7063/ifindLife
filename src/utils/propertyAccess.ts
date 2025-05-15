
import { UserProfile } from '@/types/database/unified';

/**
 * Gets the profile picture URL with consistent access
 */
export const getProfilePicture = (user: UserProfile | any): string => {
  if (!user) return '';
  return user.profile_picture || user.profilePicture || '';
};

/**
 * Gets the wallet balance with consistent access
 */
export const getWalletBalance = (user: UserProfile | any): number => {
  if (!user) return 0;
  return typeof user.wallet_balance === 'number' ? user.wallet_balance : 
         (typeof user.walletBalance === 'number' ? user.walletBalance : 0);
};

/**
 * Gets user's favorite experts array with consistent access
 */
export const getFavoriteExperts = (user: UserProfile | any): string[] => {
  if (!user) return [];
  return user.favorite_experts || user.favoriteExperts || [];
};

/**
 * Gets user's favorite programs array with consistent access
 */
export const getFavoritePrograms = (user: UserProfile | any): string[] => {
  if (!user) return [];
  return user.favorite_programs || user.favoritePrograms || [];
};
