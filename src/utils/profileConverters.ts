
import { UserProfile, UserProfileDb } from '@/types/supabase/user';
import { createAdapter } from './dataFormatters';

// Create a specialized adapter for UserProfile with custom transformations
const userProfileAdapter = createAdapter<UserProfileDb, UserProfile>(
  // DB to UI transform with custom fields
  (dbUser: UserProfileDb): UserProfile => {
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      country: dbUser.country,
      city: dbUser.city,
      currency: dbUser.currency,
      profilePicture: dbUser.profile_picture,
      walletBalance: dbUser.wallet_balance,
      createdAt: dbUser.created_at,
      referralCode: dbUser.referral_code,
      referredBy: dbUser.referred_by,
      referralLink: dbUser.referral_link,
      // Initialize related collections as empty arrays
      favoriteExperts: [],
      enrolledCourses: [],
      transactions: [],
      reviews: [],
      reports: [],
      referrals: []
    };
  }
);

// Function to convert database user to UserProfile
export const convertUserToUserProfile = (user: UserProfileDb): UserProfile => {
  if (!user) return {} as UserProfile;
  return userProfileAdapter.toUi(user);
};

// Function to convert UI UserProfile to database format
export const convertUserProfileToDb = (userProfile: UserProfile): UserProfileDb => {
  if (!userProfile) return {} as UserProfileDb;
  return userProfileAdapter.toDb(userProfile);
};
