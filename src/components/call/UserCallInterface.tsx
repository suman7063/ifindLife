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
import ConnectingModal from './modals/ConnectingModal';
import WaitingForExpertModal from './modals/WaitingForExpertModal';
import InCallModal from './modals/InCallModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [modalState, setModalState] = useState<'selection' | 'connecting' | 'waiting' | 'incall'>('selection');
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const connectingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnecting,
    isInCall,
    callState,
    duration,
    showRejoin,
    wasDisconnected,
    expertEndedCall,
    showExpertEndCallConfirmation,
    startCall,
    stopCall,
    toggleMute,
    toggleVideo,
    rejoinCall,
    confirmExpertEndCall,
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
    // Set modal to connecting state IMMEDIATELY for instant feedback
    // Use setTimeout to ensure UI updates in next tick, allowing immediate visual feedback
    setModalState('connecting');
    
    // Use setTimeout(0) to ensure state update renders before async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    setCallType(selectedCallType);
    setSelectedDuration(duration);
    
    // Calculate estimated cost
    const estimatedCost = (duration * expertPrice) / 60;
    
    // Use the already-fetched wallet balance (fetched when modal opens)
    // No need to fetch again as the modal already validated the balance
    const currentBalance = walletBalance || 0;
    
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
      setModalState('selection');
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
      setModalState('selection');
      return;
    }
    
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

    // After a brief delay, transition to waiting state
    // This gives time for the connecting modal to be visible
    connectingTimeoutRef.current = setTimeout(() => {
      setModalState('waiting');
      connectingTimeoutRef.current = null;
    }, 1500); // 1.5 seconds delay

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
      // Clear any pending timeout when modal closes
      if (connectingTimeoutRef.current) {
        clearTimeout(connectingTimeoutRef.current);
        connectingTimeoutRef.current = null;
      }
    } else {
      // Refresh wallet balance when modal opens (silently handle errors)
      fetchBalance().catch(err => {
        // Silently handle errors - they're already logged in useWallet
        console.warn('Could not fetch wallet balance on modal open:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (connectingTimeoutRef.current) {
        clearTimeout(connectingTimeoutRef.current);
      }
    };
  }, []);

  // Format duration helper
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) {
    return null;
  }

  // Render appropriate modal based on state
  if ((isInCall && callState) || modalState === 'incall') {
    if (callState) {
      return (
        <>
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
          
          {/* Expert End Call Confirmation Dialog */}
          <AlertDialog open={showExpertEndCallConfirmation} onOpenChange={() => {}}>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <span className="text-orange-600">Call Ended by Expert</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-2">
                  The expert has ended the call. Duration: <strong>{formatDuration(duration)}</strong>
                  <br />
                  <br />
                  Click "OK" to disconnect from the call channel.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={async () => {
                    await confirmExpertEndCall();
                  }}
                  className="w-full sm:w-auto"
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
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

  if (modalState === 'connecting') {
    return (
      <ConnectingModal
        isOpen={true}
        expertName={expertName}
      />
    );
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

