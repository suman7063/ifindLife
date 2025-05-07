
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon, Clock, DollarSign } from 'lucide-react';

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
  
  // Calculate current cost based on duration and expert price (price per minute)
  const currentCost = ((duration / 60) * expertPrice).toFixed(2);
  
  return (
    <Card className="border border-muted bg-muted/30 mb-2">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
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
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">Rate: ${expertPrice.toFixed(2)}/min</p>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-500">${currentCost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgoraCallInfo;
