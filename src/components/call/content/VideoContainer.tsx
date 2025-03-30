
import React from 'react';
import { CallState } from '@/utils/agoraService';
import RemoteVideoDisplay from './RemoteVideoDisplay';
import LocalVideoPreview from './LocalVideoPreview';

interface VideoContainerProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  userName: string;
  expertName: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  callState,
  callStatus,
  userName,
  expertName
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

export default VideoContainer;
