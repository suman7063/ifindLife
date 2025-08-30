import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Wifi } from 'lucide-react';
import { CallState, Expert } from '../CallInterface';

interface CallHeaderProps {
  expert: Expert;
  callState: CallState;
}

export const CallHeader: React.FC<CallHeaderProps> = ({
  expert,
  callState
}) => {
  const getStatusBadge = () => {
    switch (callState) {
      case 'connecting':
        return (
          <Badge variant="secondary" className="animate-pulse">
            <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-2" />
            Connecting...
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-500">
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border-b bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={expert.imageUrl} alt={expert.name} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{expert.name}</h3>
            <p className="text-sm text-muted-foreground">Expert Consultation</p>
          </div>
        </div>
        
        {getStatusBadge()}
      </div>
    </div>
  );
};