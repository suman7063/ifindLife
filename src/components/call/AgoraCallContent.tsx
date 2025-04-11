
import React from 'react';
import { CallState } from '@/hooks/call/useCallState';

interface AgoraCallContentProps {
  callState: CallState;
  expertName: string;
  userName: string;
}

const AgoraCallContent: React.FC<AgoraCallContentProps> = ({
  callState,
  expertName,
  userName
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative w-full h-full max-w-3xl max-h-[60vh] bg-gray-900 rounded-lg overflow-hidden">
        {/* Remote video (expert) */}
        <div id="remote-video-container" className="absolute top-0 left-0 w-full h-full bg-gray-900">
          {callState.isConnecting && !callState.hasJoined && (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Connecting to {expertName}...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Local video (user) */}
        <div id="local-video-container" className="absolute bottom-4 right-4 w-1/4 max-w-[160px] aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-white z-10">
          {callState.isMuted && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs p-1 rounded-full">
              Muted
            </div>
          )}
          
          {!callState.isVideoEnabled && (
            <div className="flex items-center justify-center h-full">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                {userName.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgoraCallContent;
