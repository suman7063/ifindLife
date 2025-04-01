
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
  created_at: string;
  enrollments?: number;
  is_favorite?: boolean;
}

export interface EnrollmentData {
  program_id: number;
  user_id: string;
  enrollment_date: string;
  payment_status: 'pending' | 'completed';
  payment_method: 'wallet' | 'gateway';
  amount_paid: number;
  transaction_id?: string;
}

export interface UserFavoriteProgram {
  id: number;
  user_id: string;
  program_id: number;
  created_at: string;
}
