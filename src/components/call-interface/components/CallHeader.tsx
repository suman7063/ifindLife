import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Wifi, Clock } from 'lucide-react';
import { CallState, Expert } from '../CallInterface';

interface SessionData {
  startTime: Date;
  duration: number;
  cost: number;
}

interface CallHeaderProps {
  expert: Expert;
  callState: CallState;
  duration?: number;
  sessionData?: SessionData | null;
}

export const CallHeader: React.FC<CallHeaderProps> = ({
  expert,
  callState,
  duration,
  sessionData
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getElapsedTime = (): number => {
    if (!sessionData?.startTime) return 0;
    return Math.floor((Date.now() - sessionData.startTime.getTime()) / 1000);
  };

  const renderTimer = () => {
    if (callState !== 'connected' || !duration) return null;
    
    const elapsedTime = getElapsedTime();
    
    return (
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-green-500 hover:bg-green-500">
          <Wifi className="h-3 w-3 mr-1" />
          Connected
        </Badge>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">
            {formatTime(elapsedTime)} / {duration}min
          </span>
        </div>
      </div>
    );
  };

  const getStatusBadge = () => {
    if (callState === 'connected') return null; // Timer handles this case
    
    switch (callState) {
      case 'connecting':
        return (
          <Badge variant="secondary" className="animate-pulse">
            <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-2" />
            Connecting...
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
        
        {renderTimer() || getStatusBadge()}
      </div>
    </div>
  );
};