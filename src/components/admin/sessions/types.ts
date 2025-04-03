
import { ReactNode } from 'react';

export interface Session {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

export interface IconOption {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface ColorOption {
  value: string;
  label: string;
}

export interface SessionsEditorProps {
  sessions?: Session[];
  setSessions?: (sessions: Session[]) => void;
}

export interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: Omit<Session, "id">) => void;
  session?: Session;
  onClose?: () => void;
}

export interface SessionsGridProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  onOpenDialog?: (session?: Session) => void;
}

export interface SessionCardProps {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
}
