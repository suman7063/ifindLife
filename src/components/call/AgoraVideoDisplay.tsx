
import React from 'react';
import { CallState } from '@/utils/agoraService';
import RemoteVideoDisplay from './content/RemoteVideoDisplay';
import LocalVideoPreview from './content/LocalVideoPreview';
import { Card } from '@/components/ui/card';

interface AgoraVideoDisplayProps {
  callState: CallState;
  userName: string;
  expertName: string;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
}

const AgoraVideoDisplay: React.FC<AgoraVideoDisplayProps> = ({ 
  callState, 
  userName, 
  expertName,
  callStatus
}) => {
  return (
    <Card className="relative w-full h-full min-h-[300px] overflow-hidden border-0">
      <RemoteVideoDisplay 
        callState={callState} 
        callStatus={callStatus} 
        expertName={expertName} 
      />
      
      <LocalVideoPreview 
        callState={callState} 
        userName={userName} 
        isJoined={callState.isJoined} 
      />
    </Card>
  );
};

export default AgoraVideoDisplay;
