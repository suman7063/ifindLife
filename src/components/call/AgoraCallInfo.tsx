
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon, Clock } from 'lucide-react';

interface AgoraCallInfoProps {
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  duration: number;
  formatTime: (seconds: number) => string;
  expertName: string;
  expertPrice: number;
}

const AgoraCallInfo: React.FC<AgoraCallInfoProps> = ({
  callStatus,
  duration,
  formatTime,
  expertName,
  expertPrice
}) => {
  if (callStatus !== 'connected') {
    return null;
  }
  
  return (
    <Card className="border border-muted bg-muted/30">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connected with <span className="font-medium">{expertName}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">{formatTime(duration)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgoraCallInfo;
