
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
  selected_services?: number[];
  created_at?: string;
  status: 'pending' | 'approved' | 'disapproved';
  profile_picture?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
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
  phone?: string;
  password: string;
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

export interface UseExpertAuthReturn extends ExpertAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  hasUserAccount: (email: string) => Promise<boolean>;
  updateProfile?: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updateAvailability?: (availabilityData: any) => Promise<boolean>;
  updateServices?: (services: number[]) => Promise<boolean>;
}
