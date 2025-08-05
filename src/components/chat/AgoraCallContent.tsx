
import React from 'react';
import { CallState } from '@/utils/agoraService';
import VideoContainer from '../call/content/VideoContainer';
import CallCostDisplay from '../call/content/CallCostDisplay';
import AgoraCallChat from '../call/AgoraCallChat';
import { ChatStatus } from '@/hooks/chat/useChatModalState';

interface AgoraCallContentProps {
  callState: CallState;
  callStatus: ChatStatus;
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
  return (
    <div className="w-full space-y-6">
      {/* Video Section */}
      <div className="bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border/50 shadow-lg">
        <div className={`flex ${showChat ? 'flex-row gap-6' : 'flex-col'} items-start`}>
          <div className={`${showChat ? 'flex-1' : 'w-full'} space-y-4`}>
            <VideoContainer 
              callState={callState}
              callStatus={callStatus}
              userName={userName}
              expertName={expertName}
              videoMode={videoMode}
            />
            
            {callStatus === 'connected' && (
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-3 border border-primary/20">
                <CallCostDisplay 
                  duration={duration}
                  remainingTime={remainingTime}
                  cost={cost}
                  formatTime={formatTime}
                  expertPrice={expertPrice}
                />
              </div>
            )}
          </div>
          
          {/* Chat Section */}
          {showChat && callStatus === 'connected' && (
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/50 shadow-inner">
                <AgoraCallChat 
                  visible={showChat}
                  userName={userName}
                  expertName={expertName}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgoraCallContent;
