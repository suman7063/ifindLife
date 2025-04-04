
// Define the base Program type
export interface Program {
  id: number;
  title: string;
  description: string;
  programType: ProgramType;
  category: string;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  enrollments?: number;
  created_at?: string;
}

// Program Type for filtering
export type ProgramType = 'wellness' | 'academic' | 'business';
