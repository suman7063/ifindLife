
export type ProgramType = 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';

export type ProgramCategory = 
  | 'wellness' 
  | 'mental_health' 
  | 'fitness' 
  | 'nutrition' 
  | 'career' 
  | 'relationships' 
  | 'personal_development'
  | 'academic'
  | 'business'
  | 'productivity'
  | 'quick-ease'
  | 'resilience-building'
  | 'super-human'
  | 'issue-based';

export interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  category: ProgramCategory;
  programType: ProgramType;
  created_at: string;
  enrollments: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export interface ProgramInsert {
  title: string;
  description: string;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  category: ProgramCategory;
  programType: ProgramType;
  enrollments?: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export interface ProgramUpdate {
  id?: number;
  title?: string;
  description?: string;
  duration?: string;
  sessions?: number;
  price?: number;
  image?: string;
  category?: ProgramCategory;
  programType?: ProgramType;
  enrollments?: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}

// Expert related types
export interface Expert {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  bio?: string;
  profile_picture?: string;
  rating?: number;
  reviews_count?: number;
  is_available?: boolean;
  created_at?: string; // Made optional
}

export interface ExtendedExpert extends Expert {
  total_sessions?: number;
  expertise_areas?: string[];
  languages?: string[];
  price_per_hour?: number;
  experience_years?: number;
  auth_id?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  certificate_urls?: string[];
  portfolio_urls?: string[];
  average_rating?: number;
  hourly_rate?: number;
  updated_at?: string;
  experience?: string;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'disapproved';
  selected_services?: number[]; // Add missing property
  created_at?: string; // Made optional to avoid errors
}

// Component Props Types
export interface ProgramGridProps {
  programs: Program[];
  currentUser?: any;
  user?: any;
  isAuthenticated?: boolean;
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
  loading?: boolean;
}

export interface ProgramCardProps {
  program: Program;
  user?: any;
  currentUser?: any;
  isAuthenticated?: boolean;
  onProgramClick?: (program: Program) => void; // Made optional to match usage
  onFavoriteToggle?: (programId: number) => void;
}

export interface ProgramCategoriesProps {
  programs?: Program[];
  programsByCategory?: Record<string, Program[]>;
  categories?: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  currentUser?: any;
  isAuthenticated?: boolean;
  user?: any;
}
