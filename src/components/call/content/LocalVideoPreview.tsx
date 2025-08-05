
import React, { useEffect, useRef } from 'react';
import { CallState } from '@/utils/agoraService';
import { UserIcon } from 'lucide-react';

interface LocalVideoPreviewProps {
  callState: CallState;
  userName: string;
  isJoined: boolean;
  isFullSize?: boolean;
}

const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({ 
  callState, 
  userName,
  isJoined,
  isFullSize = false
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

  const containerClass = isFullSize 
    ? "w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden border border-primary/30 shadow-lg"
    : "absolute bottom-2 right-2 w-24 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded overflow-hidden border-2 border-primary/40 shadow-[var(--glow-primary)]";

  const iconSize = isFullSize ? "h-16 w-16" : "h-8 w-8";
  const textSize = isFullSize ? "text-base" : "text-xs";

  return (
    <div className={containerClass}>
      {callState.localVideoTrack && callState.isVideoEnabled ? (
        <div ref={localVideoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <UserIcon className={`${iconSize} text-primary-foreground/80`} />
            <span className={`text-primary-foreground ${textSize} mt-1 font-medium`}>{userName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideoPreview;
