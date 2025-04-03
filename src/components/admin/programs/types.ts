
import { ReactNode } from 'react';
import { Program } from '@/types/programs';

export interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (programData: Program) => Promise<void>;
  program?: Program;
}

export interface ProgramsEditorProps {
  programs?: Program[];
  setPrograms?: (programs: Program[]) => void;
}

export interface ProgramGridProps {
  programs: Program[];
  isLoading: boolean;
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
}

export interface ProgramCardProps {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
}
