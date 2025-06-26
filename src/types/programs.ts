
export type ProgramType = 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';

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
}
