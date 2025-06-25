
// Unified types for the database schema
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  currency: string;
  profile_picture?: string;
  wallet_balance: number;
  created_at: string;
  updated_at?: string;
  referred_by?: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: any[];
  favorite_programs: any[];
  enrolled_courses: any[];
  reviews: any[];
  reports: any[];
  transactions: any[];
  referrals: any[];
}

export interface ExpertProfile {
  id: string;
  auth_id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  specialties?: string[];
  experience?: string;
  experience_years?: number;
  bio?: string;
  certificate_urls?: string[];
  certifications?: string[];
  profile_picture?: string;
  profile_image_url?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  hourly_rate?: number;
  currency?: string;
  timezone?: string;
  availability_hours?: any;
  languages?: string[];
  education?: string;
  linkedin_url?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  sessionType: 'user' | 'expert' | null;
  user: any | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<boolean>;
  registerExpert: (email: string, password: string, expertData: Partial<ExpertProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  hasUserAccount: boolean;
  role: 'user' | 'expert' | null;
}
