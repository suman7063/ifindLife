
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
  const layoutClass = showChat && !isInPictureInPictureMode ? 'flex-row' : 'flex-col';
  const videoContainerClass = showChat && !isInPictureInPictureMode ? 'w-1/2' : 'w-full';

  return (
    <div className={`flex ${layoutClass} items-start py-4 space-y-4 space-x-0 ${showChat && !isInPictureInPictureMode ? 'sm:space-x-6 sm:space-y-0' : ''}`}>
      <div className={`${videoContainerClass} space-y-4 relative`}>
        <VideoContainer 
          callState={callState}
          callStatus={callStatus}
          userName={userName}
          expertName={expertName}
          videoMode={videoMode}
        />
        
        {callStatus === 'connected' && (
          <CallCostDisplay 
            duration={duration}
            remainingTime={remainingTime}
            cost={cost}
            formatTime={formatTime}
            expertPrice={expertPrice}
          />
        )}
      </div>
      
      {showChat && callStatus === 'connected' && (
        <div className={`${isInPictureInPictureMode ? 'w-full mt-4' : 'w-1/2'} h-[400px]`}>
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
