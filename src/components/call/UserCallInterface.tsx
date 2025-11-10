/**
 * User Call Interface
 * Main component managing user-side call flow
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCallFlow } from '@/hooks/useCallFlow';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { balance: walletBalance, loading: walletLoading, deductCredits, checkBalance, fetchBalance } = useWallet();
  const [modalState, setModalState] = useState<'selection' | 'waiting' | 'incall'>('selection');
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);

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
    remoteVideoRef,
    callSessionId
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

  const handleStartCall = async (selectedCallType: 'audio' | 'video', duration: number) => {
    setCallType(selectedCallType);
    setSelectedDuration(duration);
    
    // Calculate estimated cost
    const estimatedCost = (duration * expertPrice) / 60;
    
    // Check wallet balance first
    const currentBalance = await fetchBalance();
    
    if (currentBalance < estimatedCost) {
      const shortfall = estimatedCost - currentBalance;
      const symbol = '₹'; // You can make this dynamic based on user currency
      
      toast.error('Insufficient wallet balance', {
        description: `You need ${symbol}${shortfall.toFixed(2)} more. Please recharge your wallet.`,
        action: {
          label: 'Add Credits',
          onClick: () => {
            onClose();
            navigate('/user-dashboard/wallet');
          }
        },
        duration: 5000
      });
      return;
    }
    
    // Deduct credits from wallet BEFORE starting call
    const deductResult = await deductCredits(
      estimatedCost,
      'booking',
      null, // Will be updated with call session ID after call is created
      'call_session',
      `Call with ${expertName} - ${duration} minutes`
    );

    if (!deductResult.success) {
      toast.error(deductResult.error || 'Failed to deduct credits from wallet');
      return;
    }

    // Set modal to waiting state
    setModalState('waiting');
    
    // Start the call (this will create the call session)
    const success = await startCall(
      selectedCallType,
      duration,
      expertId,
      expertAuthId,
      estimatedCost,
      'INR'
    );

    if (!success) {
      // If call fails, we should refund the credits
      // Note: In production, you'd want to add automatic refund here
      toast.error('Failed to start call. Please contact support for refund.');
      setModalState('selection');
      return;
    }

    // Note: callSessionId will be available in the flowState after call initiation
    // The wallet transaction reference_id can be updated later if needed
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

  // Reset when modal closes and refresh wallet balance when opens
  useEffect(() => {
    if (!isOpen) {
      setModalState('selection');
    } else {
      // Refresh wallet balance when modal opens (silently handle errors)
      fetchBalance().catch(err => {
        // Silently handle errors - they're already logged in useWallet
        console.warn('Could not fetch wallet balance on modal open:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      walletBalance={walletBalance}
      walletLoading={walletLoading}
    />
  );
};

export default UserCallInterface;

