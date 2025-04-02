
export type ProgramCategory = 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based' | 'academic' | 'business';

export type ProgramType = 'wellness' | 'academic' | 'business';

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
}
