
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraChatTypeSelector from '@/components/chat/AgoraChatTypeSelector';
import CallAuthMessage from '@/components/chat/modals/CallAuthMessage';
import CallErrorMessage from '@/components/chat/modals/CallErrorMessage';
import ChatModalContent from '@/components/chat/ChatModalContent';
import { useChatModalState } from '@/hooks/chat/useChatModalState';
import { useCallState } from '@/hooks/call/useCallState';
import { useCallTimer } from '@/hooks/call/useCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useChatInitialization } from '@/hooks/chat/useChatInitialization';

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
  const { callState, setCallState, initializeCall, endCall } = useCallState();
  
  const {
    duration,
    cost,
    remainingFreeTime,
    isExtending,
    formatTime,
    startTimer,
    resetTimer,
    pauseTimer
  } = useCallTimer(expert.price);
  
  const {
    callType,
    callError,
    startCall,
    endCall: finishCall,
    handleToggleMute,
    handleToggleVideo
  } = useCallOperations(
    expert.id,
    setCallState,
    callState,
    startTimer,
    pauseTimer,
    calculateFinalCost
  );
  
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

  const { handleStartChat, handleEndChat } = useChatInitialization({
    expertId: expert.id,
    expertName: expert.name,
    setChatType,
    setChatStatus,
    setErrorMessage,
    initializeCall,
    startCall,
    startTimer
  });

  // Helper function to calculate final cost
  const calculateFinalCost = () => {
    // Implementation can reference the useCallTimer hook
    return cost;
  };
  
  // End chat handler
  const onEndChat = async () => {
    const success = await handleEndChat(() => finishCall());
    if (success) {
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4">
          <ChatModalContent
            expertId={expert.id}
            expertName={expert.name}
            expertPrice={expert.price}
            chatStatus={chatStatus}
            chatType={chatType}
            showChat={showChat}
            errorMessage={errorMessage}
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
            onEndChat={onEndChat}
            onToggleChat={handleToggleChatPanel}
            onRetry={handleRetry}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
