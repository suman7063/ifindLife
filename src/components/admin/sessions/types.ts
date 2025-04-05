
export interface Session {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  href: string;
}

export interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export interface SessionsGridProps {
  sessions: Session[];
  isLoading: boolean;
  onOpenDialog: (session?: Session) => void;
  onDeleteSession: (sessionId: string) => void;
}

export interface SessionFormDialogProps {
  session?: Session;
  onSave: (sessionData: Omit<Session, 'id'>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SessionsEditorProps {
  // This can be empty for now, since the component doesn't take any props
}
