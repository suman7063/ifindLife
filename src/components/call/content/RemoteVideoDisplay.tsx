
import React from 'react';
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
    <div className="w-full h-full min-h-[300px] bg-slate-900 rounded-lg overflow-hidden">
      {callState.remoteUsers.length > 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <UserIcon className="h-20 w-20 text-white/50" />
            <span className="text-white mt-2">{expertName}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800">
          {renderStatusMessage()}
        </div>
      )}
    </div>
  );
};

export default RemoteVideoDisplay;
