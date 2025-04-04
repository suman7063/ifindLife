
// Define the base Program type
export interface Program {
  id: number;
  title: string;
  description: string;
  programType: ProgramType;
  category: ProgramCategory;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  enrollments?: number;
  created_at?: string;
  is_favorite?: boolean;
}

// Program Type for filtering
export type ProgramType = 'wellness' | 'academic' | 'business';

// Program Category for filtering
export type ProgramCategory = 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based';

// Interface for favorite program
export interface FavoriteProgram {
  id: string;
  user_id: string;
  program_id: number;
}

// Extended Expert type with additional UI-specific fields
export interface ExtendedExpert extends Expert {
  specialties?: string[];
  rating?: number;
  consultations?: number;
  price?: number;
  waitTime?: string;
  imageUrl?: string;
  online?: boolean;
}
