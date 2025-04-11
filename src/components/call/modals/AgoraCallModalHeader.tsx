
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExpertProfile } from '@/types/expert';

export interface AgoraCallModalHeaderProps {
  callStatus?: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  expertName?: string;
  currency?: string;
  expertPrice?: number;
  expert?: ExpertProfile | null;
  duration?: string;
  cost?: number;
  remainingTime?: string;
  onClose?: () => void;
}

const AgoraCallModalHeader: React.FC<AgoraCallModalHeaderProps> = ({ 
  callStatus = 'choosing', 
  expertName = '',
  currency = 'INR',
  expertPrice = 0,
  expert,
  duration,
  cost,
  remainingTime,
  onClose
}) => {
  // Use expert name from expert object if available
  const displayName = expert?.name || expertName;
  
  return (
    <DialogHeader>
      <DialogTitle className="text-center">
        {callStatus === 'choosing' ? 'Choose Call Type' : 
         callStatus === 'connecting' ? 'Connecting...' : 
         callStatus === 'connected' ? `Call with ${displayName}` : 
         callStatus === 'error' ? 'Call Failed' :
         'Call Ended'}
      </DialogTitle>
      <DialogDescription className="text-center">
        {callStatus === 'choosing' ? 
          `Connect with ${displayName} via audio or video call` :
         callStatus === 'connecting' ? 
          `Connecting to ${displayName}...` : 
         callStatus === 'connected' ? 
          `Connected with ${displayName} (${currency} ${expertPrice}/min)${duration ? ` - Duration: ${duration}` : ''}${remainingTime ? ` - Remaining: ${remainingTime}` : ''}` : 
         callStatus === 'error' ?
          'There was a problem connecting your call' :
          `Call with ${displayName} ended`}
      </DialogDescription>
    </DialogHeader>
  );
};

export default AgoraCallModalHeader;
