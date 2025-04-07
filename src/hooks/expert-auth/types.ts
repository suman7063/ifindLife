
import { User } from '@supabase/supabase-js';

export interface ExpertProfile {
  id: string | number;
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
  auth_id?: string;
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: (string | number)[];
}

export interface UseExpertAuthReturn {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  error?: string | null;
  initialized?: boolean;
  authInitialized: boolean; // Alias for initialized
  user?: User | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  
  // Profile methods
  updateProfile?: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updateAvailability?: (availabilityData: any) => Promise<boolean>;
  updateServices?: (serviceIds: number[]) => Promise<boolean>;
  
  // User check methods
  hasUserAccount?: () => Promise<boolean>;
}
