
import React, { useEffect, useRef } from 'react';
import { CallState } from '@/utils/agoraService';
import { UserIcon } from 'lucide-react';

interface LocalVideoPreviewProps {
  callState: CallState;
  userName: string;
  isJoined: boolean;
  videoMode?: 'side-by-side' | 'picture-in-picture';
}

const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({ 
  callState, 
  userName,
  isJoined,
  videoMode = 'side-by-side'
}) => {
  const localVideoRef = useRef<HTMLDivElement>(null);

  // Play local video track when available and enabled
  useEffect(() => {
    const { localVideoTrack, isVideoEnabled } = callState;
    
    if (localVideoTrack && localVideoRef.current && isVideoEnabled) {
      console.log("Playing local video track");
      localVideoTrack.play(localVideoRef.current);
    }
    
    return () => {
      if (localVideoTrack) {
        console.log("Stopping local video track");
        localVideoTrack.stop();
      }
    };
  }, [callState.localVideoTrack, callState.isVideoEnabled]);

  // Don't render if not joined the call yet
  if (!isJoined) {
    return null;
  }

  const containerClass = videoMode === 'picture-in-picture' 
    ? "absolute bottom-4 right-4 w-32 h-40 bg-gradient-to-br from-secondary/90 to-accent/90 rounded-lg overflow-hidden border-2 border-primary/40 shadow-lg"
    : "absolute bottom-2 right-2 w-24 h-32 bg-gradient-to-br from-secondary/90 to-accent/90 rounded overflow-hidden border-2 border-primary/40 shadow-lg";

  return (
    <div className={containerClass}>
      {callState.localVideoTrack && callState.isVideoEnabled ? (
        <div ref={localVideoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <UserIcon className="h-6 w-6 text-primary-foreground" />
            <span className="text-primary-foreground text-xs mt-1 font-medium">{userName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideoPreview;
