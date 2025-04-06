
// Expert authentication types

export interface ExpertProfile {
  id: uuid;
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
  status?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
}

export interface ExpertAuthState {
  currentExpert: ExpertProfile | null;
  isLoading: boolean;
  authInitialized: boolean;
  isAuthenticated: boolean;
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
  selected_services?: number[];
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

export interface ExpertAvailability {
  id?: string;
  expert_id: string;
  availability_type: string;
  start_date: string;
  end_date: string;
  time_slots?: ExpertTimeSlot[];
}

export interface ExpertTimeSlot {
  id?: string;
  availability_id: string;
  start_time: string;
  end_time: string;
  day_of_week?: number;
  specific_date?: string;
  is_booked?: boolean;
}

export interface ExpertService {
  id: number;
  name: string;
  rate_usd: number;
  rate_inr: number;
  description?: string;
}

export interface UseExpertAuthReturn extends ExpertAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  hasUserAccount: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updateAvailability: (availabilityData: any) => Promise<boolean>;
  updateServices: (services: number[]) => Promise<boolean>;
}

// Helper type for UUID fields
type uuid = string;
