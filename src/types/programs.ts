
export type ProgramType = 'individual' | 'group' | 'self-paced';
export type ProgramCategory = 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based';

export interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  duration_weeks: number;
  session_frequency: string;
  price: number;
  created_at: string;
  is_featured?: boolean;
  is_favorite?: boolean;
}
