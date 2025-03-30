
import React, { useEffect, useRef } from 'react';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { CallState } from '@/utils/agoraService';
import { VideoOff, UserIcon, Loader2 } from 'lucide-react';

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
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Play remote videos
  useEffect(() => {
    callState.remoteUsers.forEach(user => {
      if (user.videoTrack) {
        const key = user.uid.toString();
        const container = remoteVideosRef.current.get(key);
        
        if (container) {
          user.videoTrack.play(container);
        }
      }
    });
    
    return () => {
      callState.remoteUsers.forEach(user => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
      });
    };
  }, [callState.remoteUsers]);

  // Add ref to remote video element
  const setRemoteVideoRef = (uid: string, element: HTMLDivElement | null) => {
    if (element) {
      remoteVideosRef.current.set(uid, element);
    } else {
      remoteVideosRef.current.delete(uid);
    }
  };

  const renderStatusMessage = () => {
    if (callStatus === 'connecting') {
      return (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-white/70 animate-spin mb-2" />
          <span className="text-white text-center">Connecting to {expertName}...</span>
          <span className="text-white/60 text-sm mt-1 text-center">Please grant camera and microphone permissions if prompted</span>
        </div>
      );
    } else if (callStatus === 'ended') {
      return (
        <div className="flex flex-col items-center">
          <UserIcon className="h-16 w-16 text-white/50 mb-2" />
          <span className="text-white text-center">Call ended</span>
          <span className="text-white/60 text-sm mt-1 text-center">Thank you for using our service</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <UserIcon className="h-20 w-20 text-white/50" />
          <span className="text-white mt-2">Waiting for {expertName}...</span>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-900 rounded-lg overflow-hidden">
      {/* Remote videos (usually expert) */}
      {callState.remoteUsers.length > 0 ? (
        callState.remoteUsers.map(user => (
          <div key={user.uid} className="w-full h-full">
            {user.videoTrack ? (
              <div 
                ref={(el) => setRemoteVideoRef(user.uid.toString(), el)} 
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <div className="flex flex-col items-center">
                  <UserIcon className="h-20 w-20 text-white/50" />
                  <span className="text-white mt-2">{expertName}</span>
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
              {expertName}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800">
          {renderStatusMessage()}
        </div>
      )}
      
      {/* Local video (user) */}
      {callState.isJoined && (
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
      )}
    </div>
  );
};

export default AgoraVideoDisplay;
