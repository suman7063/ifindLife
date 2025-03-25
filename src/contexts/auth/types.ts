
import type { User } from '@supabase/supabase-js';
import { UserProfile as SupabaseUserProfile, Review as SupabaseReview, Report as SupabaseReport, Course as SupabaseCourse } from '@/types/supabase';

// Re-export the basic types directly from supabase types
export type { User };
export type UserProfile = SupabaseUserProfile;
export type Review = SupabaseReview;
export type Report = SupabaseReport;
export type Course = SupabaseCourse;
export type { UserTransaction, Expert, Referral } from '@/types/supabase';

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
  updateProfilePicture: (file: File) => Promise<string>;
  addToFavorites: (expertId: string) => Promise<void>;
  removeFromFavorites: (expertId: string) => Promise<void>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<void>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<void>;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => boolean;
  getReferralLink: () => string;
}
