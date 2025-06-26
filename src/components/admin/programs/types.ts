
import { Program, ProgramType, ProgramCategory } from '@/types/programs';

export interface ProgramGridProps {
  programs: Program[];
  isLoading: boolean;
  onEdit: (program: Program) => void;
  onDelete: (programId: number) => Promise<boolean>;
  getCategoryColor: (category: string) => string;
}

export interface FormData {
  title: string;
  description: string;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  category: ProgramCategory;
  programType: ProgramType;
}
