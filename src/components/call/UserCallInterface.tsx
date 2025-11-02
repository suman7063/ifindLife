/**
 * User Call Interface
 * Main component managing user-side call flow
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCallFlow } from '@/hooks/useCallFlow';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';
import CallTypeSelectionModal from './modals/CallTypeSelectionModal';
import WaitingForExpertModal from './modals/WaitingForExpertModal';
import InCallModal from './modals/InCallModal';

interface UserCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertAuthId: string;
  expertName: string;
  expertAvatar?: string;
  expertPrice?: number;
}

const UserCallInterface: React.FC<UserCallInterfaceProps> = ({
  isOpen,
  onClose,
  expertId,
  expertAuthId,
  expertName,
  expertAvatar,
  expertPrice = 30
}) => {
  const { user } = useSimpleAuth();
  const [modalState, setModalState] = useState<'selection' | 'waiting' | 'incall'>('selection');
  const [callType, setCallType] = useState<'audio' | 'video'>('video');

  const {
    isConnecting,
    isInCall,
    callState,
    duration,
    showRejoin,
    wasDisconnected,
    expertEndedCall,
    startCall,
    stopCall,
    toggleMute,
    toggleVideo,
    rejoinCall,
    localVideoRef,
    remoteVideoRef
  } = useCallFlow({
    onCallStarted: () => {
      console.log('✅ Call started - setting modal to incall');
      setModalState('incall');
      toast.success('Call started!');
    },
    onCallEnded: () => {
      console.log('🔴 Call ended - resetting to selection');
      setModalState('selection');
      onClose();
    }
  });

  const handleStartCall = async (selectedCallType: 'audio' | 'video', selectedDuration: number) => {
    setCallType(selectedCallType);
    setModalState('waiting');
    
    const estimatedCost = (selectedDuration * expertPrice) / 60;
    
    const success = await startCall(
      selectedCallType,
      selectedDuration,
      expertId,
      expertAuthId,
      estimatedCost,
      'INR'
    );

    if (!success) {
      setModalState('selection');
    }
  };

  const handleRejoin = async () => {
    await rejoinCall();
  };

  const handleEndCallFromRejoin = async () => {
    await stopCall();
    sessionStorage.removeItem('user_call_session');
    sessionStorage.removeItem('user_call_data');
  };

  // Update modal state based on call state
  useEffect(() => {
    if (isInCall && callState && callState.isJoined) {
      if (modalState !== 'incall') {
        setModalState('incall');
      }
    }
  }, [isInCall, callState, callState?.isJoined, modalState]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setModalState('selection');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Render appropriate modal based on state
  if ((isInCall && callState) || modalState === 'incall') {
    if (callState) {
      return (
        <InCallModal
          isOpen={true}
          onClose={onClose}
          expertName={expertName}
          expertAvatar={expertAvatar}
          callType={callType}
          callState={callState}
          duration={duration}
          showRejoin={showRejoin}
          wasDisconnected={wasDisconnected}
          expertEndedCall={expertEndedCall}
          isConnecting={isConnecting}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onEndCall={stopCall}
          onRejoin={handleRejoin}
          onEndCallFromRejoin={handleEndCallFromRejoin}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
      );
    } else if (isInCall) {
      return (
        <WaitingForExpertModal
          isOpen={true}
          expertName={expertName}
        />
      );
    }
  }

  if (modalState === 'waiting') {
    return (
      <WaitingForExpertModal
        isOpen={true}
        expertName={expertName}
      />
    );
  }

  return (
    <CallTypeSelectionModal
      isOpen={true}
      onClose={onClose}
      expertName={expertName}
      expertPrice={expertPrice}
      onStartCall={handleStartCall}
    />
  );
};

export default UserCallInterface;

