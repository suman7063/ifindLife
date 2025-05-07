
import React from 'react';
import { CallState } from '@/utils/agoraService';
import RemoteVideoDisplay from './content/RemoteVideoDisplay';
import LocalVideoPreview from './content/LocalVideoPreview';

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
    <div className="relative w-full h-full min-h-[300px]">
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
    </div>
  );
};

export default AgoraVideoDisplay;
