
import React, { useEffect, useRef } from 'react';
import { CallState } from '@/utils/agoraService';
import { UserIcon } from 'lucide-react';

interface LocalVideoPreviewProps {
  callState: CallState;
  userName: string;
  isJoined: boolean;
}

const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({ 
  callState, 
  userName,
  isJoined
}) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  
  // Play local video
  useEffect(() => {
    const { localVideoTrack, isVideoEnabled } = callState;
    
    if (localVideoTrack && localVideoRef.current && isVideoEnabled) {
      localVideoTrack.play(localVideoRef.current);
    }
    
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
    };
  }, [callState.localVideoTrack, callState.isVideoEnabled]);
  
  if (!isJoined) return null;
  
  return (
    <div className="absolute bottom-2 right-2 w-24 h-32 bg-slate-700 rounded overflow-hidden border-2 border-white/20">
      {callState.localVideoTrack && callState.isVideoEnabled ? (
        <div ref={localVideoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <UserIcon className="h-8 w-8 text-white/70" />
            <span className="text-white text-xs mt-1">{userName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideoPreview;
