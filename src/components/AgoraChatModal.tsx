
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useCallState } from '@/hooks/call/useCallState';
import { useCallTimer } from '@/hooks/call/useCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useChatModalState } from '@/hooks/chat/useChatModalState';
import { useChatInitialization } from '@/hooks/chat/useChatInitialization';
import AgoraCallModalHeader from '@/components/chat/modals/AgoraCallModalHeader';
import ChatModalContent from '@/components/chat/ChatModalContent';

interface AgoraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const AgoraChatModal: React.FC<AgoraChatModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  // Initialize call state and operations
  const { callState, setCallState, initializeCall, endCall } = useCallState();
  
  // Initialize timer
  const {
    duration,
    cost,
    remainingTime: remainingFreeTime,
    isPaused,
    isExtending,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    startTimers,
    stopTimers,
    calculateFinalCost
  } = useCallTimer(expert.price);
  
  // Initialize call operations
  const {
    callType,
    callError,
    startCall,
    endCall: finishCall,
    handleToggleMute,
    handleToggleVideo,
  } = useCallOperations(
    expert.id,
    setCallState,
    callState,
    startTimers,
    stopTimers,
    calculateFinalCost
  );
  
  // Chat modal state management
  const {
    chatStatus,
    setChatStatus,
    chatType,
    setChatType,
    errorMessage,
    setErrorMessage,
    showChat,
    handleToggleChatPanel,
    handleRetry
  } = useChatModalState(isOpen, resetTimer, endCall);
  
  // Chat initialization functions
  const {
    handleStartChat,
    handleEndChat
  } = useChatInitialization({
    expertId: expert.id,
    expertName: expert.name,
    setChatType,
    setChatStatus,
    setErrorMessage,
    initializeCall,
    startCall,
    startTimer
  });
  
  // Handle close (wrapper function)
  const handleCloseModal = () => {
    if (chatStatus === 'connected') {
      // If call is active, end it first
      handleEndChat(finishCall).then(success => {
        if (success) {
          setTimeout(() => onClose(), 1000);
        }
      });
    } else {
      onClose();
    }
  };
  
  // Handle end chat (wrapper function)
  const handleEndChatClick = async () => {
    const success = await handleEndChat(finishCall);
    if (success) {
      pauseTimer();
      // Close the modal after a short delay
      setTimeout(() => onClose(), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4">
          <AgoraCallModalHeader
            callStatus={chatStatus}
            expertName={expert.name}
            currency="₹"
            expertPrice={expert.price}
          />
          
          <div className="my-4">
            <ChatModalContent
              expertId={expert.id}
              expertName={expert.name}
              expertPrice={expert.price}
              chatStatus={chatStatus}
              chatType={chatType}
              showChat={showChat}
              errorMessage={errorMessage || callError}
              callState={callState}
              callType={callType}
              duration={duration}
              cost={cost}
              remainingFreeTime={remainingFreeTime}
              isExtending={isExtending}
              formatTime={formatTime}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onStartChat={handleStartChat}
              onEndChat={handleEndChatClick}
              onToggleChat={handleToggleChatPanel}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
