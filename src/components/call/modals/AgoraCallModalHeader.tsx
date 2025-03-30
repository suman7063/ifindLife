
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AgoraCallModalHeaderProps {
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  expertName: string;
  currency: string;
  expertPrice: number;
}

const AgoraCallModalHeader: React.FC<AgoraCallModalHeaderProps> = ({ 
  callStatus, 
  expertName, 
  currency, 
  expertPrice 
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-center">
        {callStatus === 'choosing' ? 'Choose Call Type' : 
         callStatus === 'connecting' ? 'Connecting...' : 
         callStatus === 'connected' ? `Call with ${expertName}` : 
         callStatus === 'error' ? 'Call Failed' :
         'Call Ended'}
      </DialogTitle>
      <DialogDescription className="text-center">
        {callStatus === 'choosing' ? 
          `Connect with ${expertName} via audio or video call` :
         callStatus === 'connecting' ? 
          `Connecting to ${expertName}...` : 
         callStatus === 'connected' ? 
          `Connected with ${expertName} (${currency} ${expertPrice}/min)` : 
         callStatus === 'error' ?
          'There was a problem connecting your call' :
          `Call with ${expertName} ended`}
      </DialogDescription>
    </DialogHeader>
  );
};

export default AgoraCallModalHeader;
