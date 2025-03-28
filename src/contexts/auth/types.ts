
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  profileNotFound: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>, 
    referralCode?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (expertId: number, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: number) => Promise<boolean>;
  getExpertShareLink: (expertId: number) => string;
  getReferralLink: () => string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  country: string;
  city?: string;
  referralCode?: string;
  acceptTerms: boolean;
}
