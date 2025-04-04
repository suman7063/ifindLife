
export type ProgramType = 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';

export type ProgramCategory = 
  | 'quick-ease' 
  | 'resilience-building' 
  | 'super-human' 
  | 'issue-based'
  | 'Meditation'
  | 'Stress Reduction'
  | 'Study Skills'
  | 'Time Management'
  | 'Leadership'
  | 'Team Building';

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
  enrollments?: number;
  created_at?: string;
  is_favorite?: boolean;
}

// Add ExtendedExpert interface needed by Experts page
export interface ExtendedExpert {
  id: string | number;
  name: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
  rating?: number;
  reviews_count?: number;
  specialties?: string[];
  languages?: string[];
  price?: number;
  availability?: string[];
  verified?: boolean;
  email?: string;
  phone?: string;
}
