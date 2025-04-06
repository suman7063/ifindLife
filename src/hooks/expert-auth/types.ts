
import { User } from '@supabase/supabase-js';

export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  selected_services?: number[];
  auth_id?: string;
  status?: string;
}

export interface ExpertAvailability {
  id: string;
  expert_id: string;
  availability_type: string;
  start_date: string;
  end_date: string;
  day_of_week?: string;
}

export interface ExpertTimeSlot {
  day: string;
  start_time: string;
  end_time: string;
}

export interface ExpertService {
  id: number;
  name: string;
  rate_usd: number;
  rate_inr: number;
  description?: string;
}

export type ProfileUpdateData = Partial<Omit<ExpertProfile, 'id'>>;

export interface ExpertAuthState {
  user: User | null;
  currentExpert: ExpertProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading?: boolean; // Add isLoading as optional for backward compatibility
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  bio?: string;
  specialization?: string;
  experience?: string | number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  selected_services?: number[];
  certificate_urls?: string[];
}

export interface UseExpertAuthReturn {
  user: User | null;
  currentExpert: ExpertProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  updateAvailability: (availability: ExpertTimeSlot[]) => Promise<boolean>;
  updateServices: (serviceIds: number[]) => Promise<boolean>;
  isLoading: boolean;
  authInitialized: boolean;
  hasUserAccount: (email: string) => Promise<boolean>;
}
