
import { UserProfile, Expert, Review, Report, Course, UserTransaction, User } from '@/types/supabase';

export type UserAuthContextType = {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  updateProfilePicture: (file: File) => Promise<string>;
  addToFavorites: (expert: Expert) => void;
  removeFromFavorites: (expertId: string) => void;
  rechargeWallet: (amount: number) => void;
  addReview: (expertId: string, rating: number, comment: string) => void;
  reportExpert: (expertId: string, reason: string, details: string) => void;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => boolean;
  getReferralLink: () => string;
};

// Re-export types that were originally exported from UserAuthContext
export type { UserProfile, Expert, Review, Report, Course, UserTransaction, User };
