
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraChatTypeSelector from '@/components/chat/AgoraChatTypeSelector';
import CallAuthMessage from '@/components/chat/modals/CallAuthMessage';
import CallErrorMessage from '@/components/chat/modals/CallErrorMessage';
import { CallState } from '@/utils/agoraService';
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
  const { callState, setCallState, initializeCall } = useCallState();
  
  const {
    duration,
    cost,
    remainingTime: remainingFreeTime,
    formatTime,
    startTimers,
    stopTimers
  } = useCallTimer(expert.price);

  // Helper function to calculate final cost
  const calculateFinalCost = () => {
    return cost;
  };
  
  const {
    callType,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo
  } = useCallOperations(
    expert.id,
    setCallState,
    callState,
    startTimers,
    stopTimers,
    calculateFinalCost
  );

  // Simple wrapper for the chat modal
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Chat with {expert.name}</h2>
          {!isAuthenticated && !authLoading ? (
            <CallAuthMessage expertName={expert.name} onClose={onClose} />
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Start a text or video chat with {expert.name}.
              </p>
              <AgoraChatTypeSelector 
                expert={expert}
                onSelectChatType={(type) => {
                  console.log(`Selected chat type: ${type}`);
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
