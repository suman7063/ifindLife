
import React, { useEffect, useRef } from 'react';
import { CallState } from '@/utils/agoraService';
import { UserIcon } from 'lucide-react';

interface RemoteVideoDisplayProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  expertName: string;
}

const RemoteVideoDisplay: React.FC<RemoteVideoDisplayProps> = ({ callState, callStatus, expertName }) => {
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  
  // Handle remote video display
  useEffect(() => {
    // Using the remote video track from the first remote user if available
    const remoteVideoTrack = callState.remoteUsers[0]?.videoTrack;
    
    if (remoteVideoTrack && remoteVideoRef.current && callStatus === 'connected') {
      console.log("Playing remote video track");
      remoteVideoTrack.play(remoteVideoRef.current);
    }
    
    return () => {
      if (remoteVideoTrack) {
        console.log("Stopping remote video track");
        remoteVideoTrack.stop();
      }
    };
  }, [callState.remoteUsers, callStatus]);
  
  // Choose what to display based on call status
  const renderVideoContent = () => {
    switch (callStatus) {
      case 'connecting':
        return (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-cyan-300" />
            </div>
            <p className="text-lg font-medium">Connecting to {expertName}...</p>
            <p className="text-sm text-gray-300 mt-2">Please wait while we establish the connection</p>
          </div>
        );
        
      case 'connected':
        return callState.remoteUsers[0]?.videoTrack ? (
          <div ref={remoteVideoRef} className="w-full h-full" />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-emerald-300" />
            </div>
            <p className="text-lg font-medium mt-2">{expertName}</p>
            <p className="text-sm text-gray-300 mt-1">Audio only mode</p>
          </div>
        );
        
      case 'ended':
        return (
          <div className="flex flex-col items-center justify-center text-white">
            <p className="text-lg font-medium">Call Ended</p>
            <p className="text-sm text-gray-300 mt-2">Thank you for using our service</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-white">
            <p className="text-lg font-medium text-red-400">Connection Error</p>
            <p className="text-sm text-gray-300 mt-2">Unable to connect to {expertName}</p>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 mb-4 rounded-full bg-slate-500/20 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-medium">Ready to connect with {expertName}</p>
            <p className="text-sm text-gray-300 mt-2">Select call type to begin</p>
          </div>
        );
    }
  };
  
  return (
    <div className="w-full h-full min-h-[240px] bg-slate-800 rounded-lg overflow-hidden relative">
      {renderVideoContent()}
    </div>
  );
};

export default RemoteVideoDisplay;
