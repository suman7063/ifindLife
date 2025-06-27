
export interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  sessions: number;
  price: number;
  category: string;
  image: string;
  enrollments?: number;
  created_at?: string;
  programType?: 'wellness' | 'academic' | 'business' | 'productivity' | 'leadership';
  is_favorite?: boolean;
}

export interface ProgramCardProps {
  program: Program;
  user?: any;
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
}

export interface ProgramGridProps {
  programs: Program[];
  loading?: boolean;
  user?: any;
  currentUser?: any;
  isAuthenticated?: boolean;
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
}

export interface ProgramCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  user?: any;
  programsByCategory?: Record<string, Program[]>;
  currentUser?: any;
  isAuthenticated?: boolean;
}
