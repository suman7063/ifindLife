
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpertProfile } from '@/types/supabase/expert';

export interface AgoraCallModalHeaderProps {
  expertName?: string;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  duration?: string;
  cost?: number;
  remainingTime?: string;
  currency?: string;
  expertPrice?: number;
  onClose: () => void;
}

const AgoraCallModalHeader: React.FC<AgoraCallModalHeaderProps> = ({
  expertName,
  callStatus,
  duration,
  cost,
  remainingTime,
  currency = "INR",
  expertPrice,
  onClose
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <div>
          <h2 className="font-semibold text-lg">{expertName || 'Expert'}</h2>
          <div className="text-sm text-muted-foreground">
            {callStatus === 'choosing' && `Rate: ${currency} ${expertPrice || 0}/min`}
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'connected' && (
              <div className="flex space-x-4">
                <span>Duration: {duration || '00:00'}</span>
                <span>Cost: {currency} {cost || 0}</span>
                {remainingTime && <span>Remaining: {remainingTime}</span>}
              </div>
            )}
            {callStatus === 'ended' && 'Call ended'}
            {callStatus === 'error' && 'Connection error'}
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AgoraCallModalHeader;
