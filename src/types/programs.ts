
export type ProgramType = 'wellness' | 'productivity' | 'leadership';

export type ProgramCategory = 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based';

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
