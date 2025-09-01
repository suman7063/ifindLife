import React, { useState } from 'react';
import { CallState, CallType, Expert } from './CallInterface';
import { CallVideoContainer } from './components/CallVideoContainer';
import { CallControls } from './components/CallControls';
import { CallTimer } from './components/CallTimer';
import { CallChat } from './components/CallChat';
import { CallHeader } from './components/CallHeader';

interface SessionData {
  startTime: Date;
  duration: number;
  cost: number;
}

interface CallInProgressProps {
  expert: Expert;
  callState: CallState;
  callType: CallType;
  duration: number;
  sessionData: SessionData | null;
  onEndCall: () => void;
}

export const CallInProgress: React.FC<CallInProgressProps> = ({
  expert,
  callState,
  callType,
  duration,
  sessionData,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute logic here
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Implement actual video toggle logic here
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const containerClass = isChatOpen 
    ? "flex h-[600px]" 
    : "flex flex-col h-[600px]";

  const videoContainerClass = isChatOpen 
    ? "flex-1 min-w-0" 
    : "flex-1";

  return (
    <div className="bg-background">
      <CallHeader expert={expert} callState={callState} />
      
      <div className={containerClass}>
        {/* Video/Audio Container */}
        <div className={videoContainerClass}>
          <div className="relative h-full flex flex-col">
            {/* Timer */}
            <div className="p-4 border-b">
              <CallTimer
                duration={duration}
                sessionData={sessionData}
                callState={callState}
              />
            </div>

            {/* Video Container */}
            <div className="flex-1 relative">
              <CallVideoContainer
                expert={expert}
                callState={callState}
                callType={callType}
                isVideoEnabled={isVideoEnabled}
                isMuted={isMuted}
                videoMode={isChatOpen ? 'picture-in-picture' : 'side-by-side'}
              />
            </div>

            {/* Controls */}
            <div className="p-4 border-t bg-muted/30">
              <CallControls
                callType={callType}
                isMuted={isMuted}
                isVideoEnabled={isVideoEnabled}
                isChatOpen={isChatOpen}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
                onToggleChat={handleToggleChat}
                onEndCall={onEndCall}
              />
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-80 border-l bg-muted/20">
            <CallChat
              expert={expert}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};