
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SessionCard from './SessionCard';
import { Session } from './types';

interface SessionsGridProps {
  sessions: Session[];
  isLoading: boolean;
  onOpenDialog: (session?: Session) => void;
  onDeleteSession: (sessionId: number) => void;
}

const SessionsGrid: React.FC<SessionsGridProps> = ({ 
  sessions, 
  isLoading, 
  onOpenDialog, 
  onDeleteSession 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg" />
            <div className="p-4 border border-t-0 rounded-b-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md">
        <p className="text-muted-foreground mb-4">No sessions found</p>
        <Button onClick={() => onOpenDialog()} variant="outline">Add Your First Session</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <SessionCard 
          key={session.id} 
          session={session} 
          onEdit={() => onOpenDialog(session)}
          onDelete={onDeleteSession}
        />
      ))}
    </div>
  );
};

export default SessionsGrid;
