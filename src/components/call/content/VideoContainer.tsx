
import React from 'react';
import { CallState } from '@/utils/agoraService';
import RemoteVideoDisplay from './RemoteVideoDisplay';
import LocalVideoPreview from './LocalVideoPreview';
import DemoVideoPreview from './DemoVideoPreview';

interface VideoContainerProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  userName: string;
  expertName: string;
  isDemoMode?: boolean;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  callState,
  callStatus,
  userName,
  expertName,
  isDemoMode = false
}) => {
  // Safety check for callState to prevent null errors
  const safeCallState: CallState = callState || {
    isJoined: false,
    localVideoTrack: null,
    localAudioTrack: null,
    remoteUsers: [],
    isVideoEnabled: true,
    isAudioEnabled: true,
    client: null,
    isMuted: false
  };

  // Use demo preview if in demo mode
  if (isDemoMode) {
    return (
      <div className="relative w-full h-full min-h-[300px]">
        <DemoVideoPreview
          isVideoEnabled={safeCallState.isVideoEnabled}
          isAudioEnabled={safeCallState.isAudioEnabled}
          isMuted={safeCallState.isMuted}
          userName={userName}
          expertName={expertName}
          hasRemoteUser={safeCallState.remoteUsers.length > 0}
          callStatus={callStatus as 'connecting' | 'connected'}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <RemoteVideoDisplay 
        callState={safeCallState} 
        callStatus={callStatus} 
        expertName={expertName}
      />
      <LocalVideoPreview 
        callState={safeCallState} 
        userName={userName} 
        isJoined={safeCallState.isJoined}
      />
    </div>
  );
};

export default VideoContainer;
