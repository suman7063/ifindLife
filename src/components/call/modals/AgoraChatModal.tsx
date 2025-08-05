
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraChatTypeSelector from '../AgoraChatTypeSelector';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';
import { useCallState } from '@/hooks/call/useCallState';
import { useCallTimer } from '@/hooks/call/useCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';

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
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  const [chatStatus, setChatStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [chatType, setChatType] = useState<'text' | 'video'>('text');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const { callState, setCallState, initializeCall, endCall } = useCallState();
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

  const {
    callType,
    callError,
    startCall,
    endCall: finishCall,
    handleToggleMute,
    handleToggleVideo,
    hasVideoPermission,
    hasMicrophonePermission
  } = useCallOperations(
    expert.id,
    setCallState,
    callState,
    startTimers,
    stopTimers,
    calculateFinalCost
  );
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setChatStatus('choosing');
        setChatType('text');
        setErrorMessage(null);
        setShowChat(false);
        resetTimer();
        endCall();
      }, 300);
    }
  }, [isOpen, resetTimer, endCall]);

  // Initialize chat
  const handleStartChat = async (selectedType: 'text' | 'video') => {
    try {
      setChatType(selectedType);
      setChatStatus('connecting');
      
      // Initialize the call/chat infrastructure
      await initializeCall({
        expertId: expert.id.toString(),
        expertName: expert.name,
        chatMode: true
      });
      
      // Start a call of appropriate type
      const success = await startCall(selectedType === 'video' ? 'video' : 'audio');
      
      if (success) {
        setChatStatus('connected');
        startTimer();
      } else {
        setErrorMessage('Failed to initialize chat session. Please try again.');
        setChatStatus('error');
      }
      
    } catch (error: any) {
      console.error('Failed to start chat:', error);
      setErrorMessage('Failed to initialize chat session. Please try again.');
      setChatStatus('error');
    }
  };

  // Retry connection
  const handleRetry = async () => {
    setChatStatus('choosing');
    setErrorMessage(null);
  };

  // End chat - fix here, removing the argument
  const handleEndChat = async () => {
    try {
      // Fix here: don't pass argument to finishCall
      const result = await finishCall();
      
      if (result.success) {
        setChatStatus('ended');
        pauseTimer();
        toast.success(`Chat ended successfully. ${result.cost > 0 ? `Total cost: ₹${result.cost.toFixed(2)}` : ''}`);
      } else {
        setErrorMessage('Failed to end chat properly. Please refresh the page.');
        setChatStatus('error');
      }
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error ending chat:', error);
      setErrorMessage('Failed to end chat properly. Please refresh the page.');
      setChatStatus('error');
    }
  };

  const handleToggleChatPanel = () => {
    setShowChat(!showChat);
  };

  // Modal content based on state
  const renderModalContent = () => {
    // Show auth message if not authenticated
    if (!isAuthenticated && !authLoading) {
      return <CallAuthMessage expertName={expert.name} onClose={onClose} />;
    }

    // Show error message
    if (chatStatus === 'error') {
      return <CallErrorMessage 
        errorMessage={errorMessage || 'An error occurred'} 
        onRetry={handleRetry} 
      />;
    }

    // Type selection
    if (chatStatus === 'choosing') {
      return (
        <AgoraChatTypeSelector 
          expert={expert} 
          onSelectChatType={handleStartChat} 
        />
      );
    }

    // Connected or connecting
    return (
      <>
        <AgoraCallContent
          callState={callState}
          callStatus={chatStatus}
          showChat={showChat}
          duration={duration}
          remainingTime={remainingFreeTime}
          cost={cost}
          formatTime={formatTime}
          expertPrice={expert.price}
          userName={userProfile?.name || 'You'}
          expertName={expert.name}
        />
        
        {chatStatus === 'connected' && (
          <div className="flex justify-center mt-4">
            <AgoraCallControls
              callState={callState}
              callType={callType}
              
              isFullscreen={false}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndChat}
              
              onToggleChat={handleToggleChatPanel}
              onToggleFullscreen={() => {}}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4">
          <AgoraCallModalHeader
            callStatus={chatStatus}
            expertName={expert.name}
            currency="₹"
            expertPrice={expert.price}
          />
          
          <div className="my-4">
            {renderModalContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
