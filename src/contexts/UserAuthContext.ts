
import { createContext } from 'react';
import { UserProfile, Expert } from '@/types/supabase';
import { ReviewUI, Report } from '@/types/supabase/reviews';
import { Course, UserTransaction } from '@/types/supabase';
import { User } from '@/types/supabase/tables';

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
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<string>;
  addToFavorites: (expert: Expert) => void;
  removeFromFavorites: (expertId: string) => void;
  rechargeWallet: (amount: number) => void;
  addReview: (expertId: string, rating: number, comment: string) => void;
  reportExpert: (expertId: string, reason: string, details: string) => void;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getReferralLink: () => string;
};

// Create the context with undefined as default value
export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Also export User for components that need to use this type
export { User };
