
export interface ExpertProfile {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[];
}

export interface ExpertTimeSlot {
  id?: string;
  expert_id?: string;
  day_of_week?: number;
  day?: number;
  start_time: string;
  end_time: string;
  is_booked?: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
}

// Add the missing ExpertAuthState export
export interface ExpertAuthState {
  currentExpert: ExpertProfile | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
}

// Add the missing UseExpertAuthReturn export
export interface UseExpertAuthReturn {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  authInitialized: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  hasUserAccount: () => Promise<boolean>;
}

// Import User type from Supabase for proper typing
import { User } from '@supabase/supabase-js';
