
import { User } from '@supabase/supabase-js';
import { UserProfile, Expert, Review, Report, Course, UserTransaction } from '@/types/supabase';

export type UserAuthContextType = {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  profileNotFound: boolean;
  user: User | null;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Profile management
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  
  // Expert interactions
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string) => string;
  
  // Wallet & referrals
  rechargeWallet: (amount: number) => Promise<boolean>;
  getReferralLink: () => string | null;
};

export type { User, UserProfile, Expert, Review, Report, Course, UserTransaction };
