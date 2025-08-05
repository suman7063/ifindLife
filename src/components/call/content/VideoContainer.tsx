
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
  videoMode?: 'side-by-side' | 'picture-in-picture';
  isDemoMode?: boolean;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  callState,
  callStatus,
  userName,
  expertName,
  videoMode = 'side-by-side',
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

  const containerClass = videoMode === 'picture-in-picture' 
    ? "relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
    : "relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20";

  return (
    <div className={containerClass}>
      <RemoteVideoDisplay 
        callState={safeCallState} 
        callStatus={callStatus} 
        expertName={expertName}
        videoMode={videoMode}
      />
      <LocalVideoPreview 
        callState={safeCallState} 
        userName={userName} 
        isJoined={safeCallState.isJoined}
        videoMode={videoMode}
      />
    </div>
  );
};

export default VideoContainer;
