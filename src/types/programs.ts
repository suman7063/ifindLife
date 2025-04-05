
export type ProgramType = 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';
export type ProgramCategory = 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based' | 'Meditation' | 'Stress Reduction' | 'Study Skills' | 'Time Management' | 'Leadership' | 'Team Building';

export interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  created_at: string;
  is_featured?: boolean;
  is_favorite?: boolean;
  
  // Previously existing fields for backward compatibility
  image_url?: string;
  duration_weeks?: number;
  session_frequency?: string;
  
  // New fields being used in the application
  duration?: string;
  sessions?: number;
  image?: string;
  programType?: ProgramType;
  enrollments?: number;
}
