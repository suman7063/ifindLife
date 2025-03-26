
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfile as SupabaseUserProfile, Review as SupabaseReview, Report as SupabaseReport, Course as SupabaseCourse } from '@/types/supabase';

// Re-export the User type directly from supabase-js
export type User = SupabaseUser;
export type UserProfile = SupabaseUserProfile;
export type Review = SupabaseReview;
export type Report = SupabaseReport;
export type Course = SupabaseCourse;
export type { UserTransaction, Expert, Referral } from '@/types/supabase';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  profileNotFound: boolean;
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
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getReferralLink: () => string | null;
  user: SupabaseUser | null;
}
