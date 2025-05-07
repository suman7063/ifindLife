
import React, { useEffect, useState } from 'react';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { CallState } from '@/utils/agoraService';
import { UserIcon, Loader2 } from 'lucide-react';

interface RemoteVideoDisplayProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  expertName: string;
}

const RemoteVideoDisplay: React.FC<RemoteVideoDisplayProps> = ({ 
  callState, 
  callStatus,
  expertName
}) => {
  const [videoContainers, setVideoContainers] = useState<Map<string, HTMLDivElement>>(new Map());
  
  // Effect to play remote videos whenever remote users or video containers change
  useEffect(() => {
    callState.remoteUsers.forEach(user => {
      if (user.videoTrack) {
        const containerId = user.uid.toString();
        const container = videoContainers.get(containerId);
        
        if (container) {
          console.log("Playing remote video for user:", containerId);
          user.videoTrack.play(container);
        }
      }
    });
    
    return () => {
      callState.remoteUsers.forEach(user => {
        if (user.videoTrack) {
          console.log("Stopping remote video for user:", user.uid.toString());
          user.videoTrack.stop();
        }
      });
    };
  }, [callState.remoteUsers, videoContainers]);

  // Register a container reference
  const setContainerRef = (id: string, element: HTMLDivElement | null) => {
    setVideoContainers(prev => {
      const newMap = new Map(prev);
      
      if (element) {
        newMap.set(id, element);
      } else {
        newMap.delete(id);
      }
      
      return newMap;
    });
  };

  // Render status message for different call states
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
    } else if (callStatus === 'error') {
      return (
        <div className="flex flex-col items-center">
          <UserIcon className="h-16 w-16 text-white/50 mb-2" />
          <span className="text-white text-center">Call error</span>
          <span className="text-white/60 text-sm mt-1 text-center">Please try again</span>
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
      {/* Remote videos (expert) */}
      {callState.remoteUsers.length > 0 ? (
        callState.remoteUsers.map(user => (
          <div key={user.uid} className="w-full h-full">
            {user.videoTrack ? (
              <div 
                ref={(element) => setContainerRef(user.uid.toString(), element)}
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
    </div>
  );
};

export default RemoteVideoDisplay;
