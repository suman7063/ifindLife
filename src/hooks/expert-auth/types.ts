
import { Expert } from '@/types/expert';

export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  profilePicture?: string;
  certificate_urls?: string[];  // Added this property to fix the build error
}

export interface ExpertAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentExpert: ExpertProfile | null;
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
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[];
}

export interface UseExpertAuthReturn extends ExpertAuthState {
  // Core authenticated user data
  expert: ExpertProfile | null;
  loading: boolean;
  authInitialized: boolean;
  
  // Helper methods
  hasUserAccount: (email: string) => Promise<boolean>;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
}
