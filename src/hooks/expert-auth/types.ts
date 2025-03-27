
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
}

export interface ExpertAuthState {
  expert: ExpertProfile | null;
  loading: boolean;
  authInitialized: boolean;
}

export interface UseExpertAuthReturn extends ExpertAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (expertData: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (profileData: Partial<ExpertProfile>) => Promise<boolean>;
  uploadCertificate: (file: File) => Promise<string | null>;
  removeCertificate: (certificateUrl: string) => Promise<boolean>;
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
