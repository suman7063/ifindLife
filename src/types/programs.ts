
export type ProgramType = 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';

export type ProgramCategory = 'wellness' | 'mental_health' | 'fitness' | 'nutrition' | 'career' | 'relationships' | 'personal_development' | 'academic' | 'business' | 'productivity';

export interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  category: string;
  sessions: number;
  price: number;
  created_at: string;
  enrollments: number;
  programType: ProgramType;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export interface ProgramInsert {
  title: string;
  description: string;
  duration: string;
  image: string;
  category: string;
  sessions: number;
  price: number;
  programType?: ProgramType;
  enrollments?: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export interface ProgramUpdate {
  title?: string;
  description?: string;
  duration?: string;
  image?: string;
  category?: string;
  sessions?: number;
  price?: number;
  programType?: ProgramType;
  enrollments?: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export interface ExtendedExpert {
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
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
}
