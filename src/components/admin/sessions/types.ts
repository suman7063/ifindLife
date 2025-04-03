
export interface Session {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
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
}

export interface SessionsGridProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

export interface SessionCardProps {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
}
