
// Basic expert profile type
export interface ExpertProfile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  hourly_rate?: number;
  status: 'pending' | 'approved' | 'rejected';
  profilePicture?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields from database
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string; // Changed to string to match supabase type
  certificate_urls?: string[]; // Add this to match supabase
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

// Expert registration data type
export interface ExpertRegistrationData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  hourly_rate?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
  certificates?: File[];
  // Additional fields needed for registration
  specialization?: string; // Add this
  experience?: string; // Add this as string
  certificate_urls?: string[]; // Add this
  selected_services?: number[]; // Add this
}

// Time slot type for availability
export interface ExpertTimeSlot {
  id?: string;
  expert_id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  day?: string; // Keep this property
}

// Profile update data
export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  hourly_rate?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
}

// Expert auth state
export interface ExpertAuthState {
  initialized: boolean;
  loading: boolean;
  currentExpert: ExpertProfile | null;
  error: string | null;
}

// Return type for useExpertAuth hook
export interface UseExpertAuthReturn {
  initialized: boolean;
  loading: boolean;
  currentExpert: ExpertProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasUserAccount: () => Promise<boolean>;
  register: (data: ExpertRegistrationData) => Promise<boolean>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  error: string | null;
}

// Expert form data for legacy components
export interface ExpertFormData {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  hourly_rate?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: 'pending' | 'approved' | 'rejected';
  reportedUsers?: any[];
  profilePicture?: string;
  password?: string;
  confirmPassword?: string;
  specialization?: string;
  experience?: string;
  certificates?: File[];
  certificateUrls?: string[];
  selectedServices?: number[];
  acceptedTerms?: boolean;
}
