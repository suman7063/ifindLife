
import React from 'react';
import { CallState } from '@/utils/agoraService';
import VideoContainer from './content/VideoContainer';
import CallCostDisplay from './content/CallCostDisplay';
import AgoraCallChat from './AgoraCallChat';

interface AgoraCallContentProps {
  callState: CallState;
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  showChat: boolean;
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
  duration,
  remainingTime,
  cost,
  formatTime,
  expertPrice,
  userName,
  expertName
}) => {
  return (
    <div className={`flex ${showChat ? 'flex-row' : 'flex-col'} items-center py-3 space-y-4 space-x-0 ${showChat ? 'sm:space-x-4 sm:space-y-0' : ''}`}>
      <div className={`${showChat ? 'w-1/2' : 'w-full'} space-y-4`}>
        <VideoContainer 
          callState={callState}
          callStatus={callStatus}
          userName={userName}
          expertName={expertName}
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
        <div className="w-1/2 h-[400px]">
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
