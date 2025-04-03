
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { Session } from './types';
import { renderIcon } from './sessionIcons';

interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (sessionId: number) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onEdit, onDelete }) => {
  return (
    <Card key={session.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 ${session.color} rounded-full flex items-center justify-center`}>
              {renderIcon(session.icon)}
            </div>
            <h3 className="text-lg font-semibold">{session.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-3 mb-3">{session.description}</p>
        <Badge variant="outline" className="text-xs">
          {session.href}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between bg-gray-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(session)}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(session.id)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
