
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
  profile_picture?: string | null;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
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
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string | null;
  selected_services?: number[];
}

export interface ExpertAuthState {
  expert: ExpertProfile | null;
  loading: boolean;
  authInitialized: boolean;
}

export interface UseExpertAuthReturn extends ExpertAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  uploadCertificate: (certificateUrl: string) => Promise<boolean>;
  removeCertificate: (certificateUrl: string) => Promise<boolean>;
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>;
  isUserLoggedIn: () => Promise<boolean>;
  hasUserAccount: (email: string) => Promise<boolean>;
}
