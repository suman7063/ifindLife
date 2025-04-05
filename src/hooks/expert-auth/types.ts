
// Expert authentication related types

export interface ExpertProfile {
  id: string | number;
  auth_id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: string;
  specialization?: string;
  experience?: string | number;
  verified?: boolean;
  certificate_urls?: string[];
  selected_services?: string[] | number[];
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  status?: 'active' | 'inactive' | 'pending';
  availability?: ExpertAvailability[];
  services?: ExpertService[];
  pricing?: {
    price_per_min?: number;
    consultation_fee?: number;
  };
}

export interface ExpertAvailability {
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface ExpertService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
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
  selected_services?: string[] | number[];
}

export interface ExpertAuthState {
  currentExpert: ExpertProfile | null;
  isLoading: boolean;
  authInitialized: boolean;
  isAuthenticated: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
}

export interface UseExpertAuthReturn extends ExpertAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  hasUserAccount: (email: string) => Promise<boolean>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  updateAvailability: (availability: ExpertAvailability[]) => Promise<boolean>;
  updateServices: (services: ExpertService[]) => Promise<boolean>;
}
