
import React from 'react';
import { CallState } from '@/utils/agoraService';
import VideoContainer from './content/VideoContainer';
import CallCostDisplay from './content/CallCostDisplay';
import AgoraCallChat from './AgoraCallChat';

interface AgoraCallContentProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  showChat: boolean;
  videoMode?: 'side-by-side' | 'picture-in-picture';
  duration: number;
  remainingTime: number;
  cost: number;
  formatTime: (seconds: number) => string;
  expertPrice: number;
  userName: string;
  expertName: string;
}

const AgoraCallContent: React.FC<AgoraCallContentProps> = ({
  callState,
  callStatus,
  showChat,
  videoMode = 'side-by-side',
  duration,
  remainingTime,
  cost,
  formatTime,
  expertPrice,
  userName,
  expertName
}) => {
  const isInPictureInPictureMode = videoMode === 'picture-in-picture';
  
  // Dynamic layout based on video mode and chat visibility
  const getLayoutClass = () => {
    if (isInPictureInPictureMode) {
      return 'flex-col'; // PiP mode stacks video and chat vertically
    }
    return showChat ? 'flex-row' : 'flex-col'; // Side-by-side when chat is open
  };
  
  const getVideoContainerClass = () => {
    if (isInPictureInPictureMode) {
      return 'w-full'; // Full width for main video in PiP mode
    }
    return showChat ? 'w-1/2' : 'w-full'; // Half width when chat is open in side-by-side
  };

  return (
    <div className={`flex ${getLayoutClass()} items-start py-4 space-y-4 space-x-0 ${showChat && !isInPictureInPictureMode ? 'sm:space-x-6 sm:space-y-0' : ''}`}>
      <div className={`${getVideoContainerClass()} space-y-4 relative`}>
        <VideoContainer 
          callState={callState}
          callStatus={callStatus}
          userName={userName}
          expertName={expertName}
          videoMode={videoMode}
        />
        
        {/* Cost display removed as per user request */}
      </div>
      
      {showChat && callStatus === 'connected' && (
        <div className={`${isInPictureInPictureMode ? 'w-full mt-4' : 'w-1/2'} h-[400px] ${!isInPictureInPictureMode ? 'border-l-2 border-primary/20 pl-4' : ''}`}>
          <AgoraCallChat 
            visible={showChat}
            userName={userName}
            expertName={expertName}
          />
        </div>
      )}
    </div>
  );
};

export default AgoraCallContent;
