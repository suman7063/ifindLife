
import { createContext } from 'react';
import { UserProfile, Expert } from '@/types/supabase';

export interface UserAuthContextType {
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
  rechargeWallet: (amount: number) => Promise<void>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<void>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<void>;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getReferralLink: () => string;
  bookAppointment: (appointmentData: {
    expertId: string;
    expertName: string;
    appointmentDate: string;
    duration: number;
    notes?: string;
    price: number;
    currency: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

export const UserAuthContext = createContext<UserAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateProfile: async () => {},
  updateProfilePicture: async () => '',
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  rechargeWallet: async () => {},
  addReview: async () => {},
  reportExpert: async () => {},
  getExpertShareLink: () => '',
  hasTakenServiceFrom: async () => false,
  getReferralLink: () => '',
  bookAppointment: async () => ({ success: false }),
});
