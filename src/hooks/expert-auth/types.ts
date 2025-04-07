
import { User } from '@supabase/supabase-js';

export interface ExpertProfile {
  id: string;
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

// Add ExpertAuthState type
export interface ExpertAuthState {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  user: User | null;
}

// Add ProfileUpdateData type
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

// Update ExpertTimeSlot type to include day field
export interface ExpertTimeSlot {
  id?: string;
  availability_id?: string;
  day_of_week?: number;
  specific_date?: string;
  start_time: string;
  end_time: string;
  is_booked?: boolean;
  day?: number; // Adding day field that was being used
}

// Add ReportUserType
export interface ReportUserType {
  id?: string;
  user_id: string;
  expert_id: string; // Changed to string
  reason: string;
  details: string;
  date?: string;
  status?: string;
  userName?: string;
}
