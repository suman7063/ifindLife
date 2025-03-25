
import { User } from '@supabase/supabase-js';

export interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  profilePicture?: string;
}

export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
}

export interface Course {
  id: string;
  title: string;
  expertId: string;
  expertName: string;
  enrollmentDate: string;
  progress: number;
  completed: boolean;
}

export interface UserTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface Referral {
  id: string;
  referrerId?: string;
  referredId: string;
  status: 'pending' | 'completed';
  date: string;
  reward?: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  profilePicture?: string;
  walletBalance?: number;
  currency?: string;
  referralCode?: string;
  referralLink?: string;
  favorites?: string[];
  courses?: Course[];
  reviews?: Review[];
  reports?: Report[];
  transactions?: UserTransaction[];
  referrals?: Referral[];
}

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
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
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  addToFavorites: (expertId: string) => Promise<void>;
  removeFromFavorites: (expertId: string) => Promise<void>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<void>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<void>;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => boolean;
  getReferralLink: () => string;
}
