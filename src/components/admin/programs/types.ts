
import { ReactNode } from 'react';
import { Program } from '@/types/programs';

export interface ProgramFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programData: Program) => Promise<void>;
  program: Program | null;
}

export interface ProgramsEditorProps {
  programs?: Program[];
  setPrograms?: (programs: Program[]) => void;
}

export interface ProgramGridProps {
  programs: Program[];
  isLoading: boolean;
  onEdit: (program: Program) => void;
  onDelete: (programId: number) => void;
  getCategoryColor?: (category: string) => string;
}

export interface ProgramCardProps {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (programId: number) => void;
  getCategoryColor?: (category: string) => string;
}
