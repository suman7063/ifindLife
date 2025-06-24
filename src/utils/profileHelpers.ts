
import type { UserProfile } from '@/types/database/unified';

// Property access helpers to handle both naming conventions
export const getUserWalletBalance = (user: UserProfile | null): number => {
  if (!user) return 0;
  return user.walletBalance || user.wallet_balance || 0;
};

export const getUserFavoriteExperts = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.favoriteExperts || user.favorite_experts || [];
};

export const getUserEnrolledCourses = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.enrolledCourses || user.enrolled_courses || [];
};

export const getUserProfilePicture = (user: UserProfile | null): string | undefined => {
  if (!user) return undefined;
  return user.profilePicture || user.profile_picture;
};

export const getUserFavoritePrograms = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.favorite_programs || [];
};

export const getUserTransactions = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.transactions || [];
};

export const getUserReviews = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.reviews || [];
};

export const getUserReports = (user: UserProfile | null): any[] => {
  if (!user) return [];
  return user.reports || [];
};
