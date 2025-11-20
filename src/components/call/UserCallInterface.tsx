/**
 * User Call Interface
 * Main component managing user-side call flow
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCallFlow } from '@/hooks/useCallFlow';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useUserCurrency } from '@/hooks/useUserCurrency';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CallTypeSelectionModal from './modals/CallTypeSelectionModal';

// Component to detect when Razorpay modal appears
const RazorpayDetector: React.FC<{ onRazorpayDetected: () => void }> = ({ onRazorpayDetected }) => {
  useEffect(() => {
    const checkRazorpay = () => {
      const razorpayElements = document.querySelectorAll(
        'iframe[src*="razorpay"], iframe[src*="checkout.razorpay"], [id*="razorpay-checkout"], [class*="razorpay-checkout"], [id*="razorpay"], [class*="razorpay"]'
      );
      if (razorpayElements.length > 0) {
        onRazorpayDetected();
        return true;
      }
      return false;
    };
    
    // Check immediately
    if (checkRazorpay()) {
      return;
    }
    
    // Poll for Razorpay modal appearance (check every 100ms for up to 10 seconds)
    let checkCount = 0;
    const maxChecks = 100; // 10 seconds max
    const checkInterval = setInterval(() => {
      checkCount++;
      if (checkRazorpay() || checkCount >= maxChecks) {
        clearInterval(checkInterval);
        if (checkCount >= maxChecks) {
          console.warn('⚠️ Razorpay modal not detected after 10 seconds, hiding loader anyway');
          onRazorpayDetected();
        }
      }
    }, 100);
    
    return () => clearInterval(checkInterval);
  }, [onRazorpayDetected]);
  
  return null;
};
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
  const { symbol: currencySymbol } = useUserCurrency();
  const [modalState, setModalState] = useState<'selection' | 'connecting' | 'waiting' | 'incall'>('selection');
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [pendingCallCost, setPendingCallCost] = useState<{ amount: number; currency: 'INR' | 'EUR' } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const connectingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTransactionIdRef = useRef<string | null>(null);

  const {
    isConnecting,
    isInCall,
    callState,
    duration,
    showRejoin,
    wasDisconnected,
    expertEndedCall,
    showExpertEndCallConfirmation,
    expertDeclinedCall,
    showExpertDeclinedCallConfirmation,
    startCall,
    stopCall,
    toggleMute,
    toggleVideo,
    rejoinCall,
    confirmExpertEndCall,
    confirmExpertDeclinedCall,
    localVideoRef,
    remoteVideoRef,
    callSessionId
  } = useCallFlow({
    onExpertAccepted: async () => {
      // Deduct credits IMMEDIATELY when expert accepts (not when call connects)
      // This ensures full session price is deducted as soon as expert accepts
      if (pendingCallCost && callSessionId) {
        try {
          console.log('💰 Expert accepted - Deducting session price immediately:', {
            amount: pendingCallCost.amount,
            currency: pendingCallCost.currency,
            callSessionId,
            duration: selectedDuration,
            expertName,
            note: 'Full session price deducted on expert acceptance'
          });
          
          const deductResult = await deductCredits(
            pendingCallCost.amount,
            'booking',
            callSessionId,
            'call_session',
            `Call with ${expertName} - ${selectedDuration} minutes`,
            pendingCallCost.currency
          );
          
          console.log('💰 Deduct result:', deductResult);

          if (!deductResult.success) {
            console.error('❌ Failed to deduct credits:', deductResult.error);
            toast.error('Failed to deduct credits. Call may be disconnected.');
            // Don't disconnect the call, but log the error
          } else {
            console.log('✅ Credits deducted successfully on expert acceptance:', pendingCallCost.amount);
            // Store transaction ID to update later if needed
            if (deductResult.transaction?.id) {
              pendingTransactionIdRef.current = deductResult.transaction.id;
            }
          }
          
          // Clear pending cost after deduction attempt
          setPendingCallCost(null);
        } catch (error) {
          console.error('❌ Error deducting credits on expert acceptance:', error);
          toast.error('Failed to deduct credits');
          setPendingCallCost(null);
        }
      } else {
        console.warn('⚠️ No pending call cost or call session ID when expert accepted');
      }
    },
    onCallStarted: async () => {
      console.log('✅ Call started - setting modal to incall');
      setModalState('incall');
      toast.success('Call started!');
    },
    onCallEnded: () => {
      console.log('🔴 Call ended - resetting to selection');
      setModalState('selection');
      setPendingCallCost(null); // Clear pending cost if call ends before connecting
      onClose();
    }
  });

  const handleStartCall = async (
    selectedCallType: 'audio' | 'video', 
    duration: number, 
    estimatedCost: number,
    currency: 'INR' | 'EUR'
  ) => {
    console.log('📞 handleStartCall called in UserCallInterface:', {
      selectedCallType,
      duration,
      estimatedCost,
      currency,
      currentModalState: modalState,
      isOpen: isOpen
    });
    
    // IMPORTANT: Set modal to connecting state IMMEDIATELY for instant feedback
    // This ensures the modal state updates even if CallTypeSelectionModal was closed
    setModalState('connecting');
    
    // Use setTimeout(0) to ensure state update renders before async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    console.log('✅ Modal state updated to connecting, proceeding with call setup...');
    
    setCallType(selectedCallType);
    setSelectedDuration(duration);
    
    // Use the actual session price passed from the modal (not per-minute calculation)
    console.log('💰 UserCallInterface - Using session price:', {
      estimatedCost,
      duration,
      currency,
      willBeDeducted: 'on call connect'
    });
    
    // Store the cost to deduct when call connects (not now)
    setPendingCallCost({ amount: estimatedCost, currency });
    
    // Refresh wallet balance to get latest balance after payment
    // This ensures we have the updated balance from the payment
    console.log('💰 Refreshing wallet balance before starting call...');
    await fetchBalance();
    
    // Wait a moment for balance to update
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Use the refreshed wallet balance
    const currentBalance = walletBalance || 0;
    
    console.log('💰 Wallet balance check:', {
      currentBalance,
      estimatedCost,
      sufficient: currentBalance >= estimatedCost
    });
    
    if (currentBalance < estimatedCost) {
      const shortfall = estimatedCost - currentBalance;
      console.warn('⚠️ Still insufficient balance after payment:', shortfall);
      
      toast.error('Insufficient wallet balance', {
        description: `You need ${currencySymbol}${shortfall.toFixed(2)} more. Please recharge your wallet.`,
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
      setPendingCallCost(null);
      return;
    }
    
    // Start the call (this will create the call session)
    // Pass currency correctly (INR or EUR)
    console.log('📞 Calling startCall function with:', {
      selectedCallType,
      duration,
      expertId,
      expertAuthId,
      estimatedCost,
      currency
    });
    
    const success = await startCall(
      selectedCallType,
      duration,
      expertId,
      expertAuthId,
      estimatedCost,
      currency
    );

    console.log('📞 startCall returned:', success);

    if (!success) {
      // If call fails, clear pending cost (no deduction happened)
      console.error('❌ startCall returned false - call failed to start');
      toast.error('Failed to start call. Please try again.');
      setModalState('selection');
      setPendingCallCost(null);
      return;
    }
    
    console.log('✅ startCall succeeded - call session created, waiting for expert...');

    // After a brief delay, transition to waiting state
    // This gives time for the connecting modal to be visible
    connectingTimeoutRef.current = setTimeout(() => {
      setModalState('waiting');
      connectingTimeoutRef.current = null;
    }, 1500); // 1.5 seconds delay
  };

  const handleRejoin = async () => {
    await rejoinCall();
  };

  const handleEndCallFromRejoin = async () => {
    await stopCall();
    sessionStorage.removeItem('user_call_session');
    sessionStorage.removeItem('user_call_data');
  };

  // Update wallet transaction with call session ID when call session is created
  useEffect(() => {
    if (callSessionId && pendingTransactionIdRef.current) {
      const updateTransaction = async () => {
        try {
          const { supabase: supabaseClient } = await import('@/integrations/supabase/client');
          // wallet_transactions table exists but may not be in TypeScript types
          // Using type assertion to access wallet_transactions table
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const supabaseAny = supabaseClient as any;
          const { error: updateError } = await supabaseAny
            .from('wallet_transactions')
            .update({ 
              reference_id: callSessionId,
              reference_type: 'call_session'
            })
            .eq('id', pendingTransactionIdRef.current);

          if (updateError) {
            console.error('Failed to update wallet transaction with call session ID:', updateError);
            // Don't show error to user as transaction was already created successfully
          } else {
            console.log('✅ Wallet transaction updated with call session ID:', callSessionId);
            pendingTransactionIdRef.current = null; // Clear after successful update
          }
        } catch (error) {
          console.error('Error updating wallet transaction:', error);
        }
      };

      updateTransaction();
    }
  }, [callSessionId]);

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
      // Reset to selection when modal opens
      setModalState('selection');
      // Refresh wallet balance when modal opens
      fetchBalance().catch(err => {
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

  // This useEffect is now handled in the isOpen useEffect above

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

          {/* Expert Declined Call Confirmation Dialog */}
          <AlertDialog open={showExpertDeclinedCallConfirmation} onOpenChange={() => {}}>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <span className="text-orange-600">Call Declined by Expert</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-2">
                  The expert has declined your call request.
                  <br />
                  <br />
                  Click "OK" to close and cancel the call.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={async () => {
                    setPendingCallCost(null); // Clear pending cost since call was declined
                    await confirmExpertDeclinedCall();
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
      <>
        <ConnectingModal
          isOpen={true}
          expertName={expertName}
        />
        {/* Expert Declined Call Confirmation Dialog - shown even in connecting state */}
        <AlertDialog open={showExpertDeclinedCallConfirmation} onOpenChange={() => {}}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="text-orange-600">Call Declined by Expert</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-2">
                The expert has declined your call request.
                <br />
                <br />
                Click "OK" to close and cancel the call.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={async () => {
                  await confirmExpertDeclinedCall();
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
  }

  if (modalState === 'waiting') {
    return (
      <>
        <WaitingForExpertModal
          isOpen={true}
          expertName={expertName}
        />
        {/* Expert Declined Call Confirmation Dialog - shown even in waiting state */}
        <AlertDialog open={showExpertDeclinedCallConfirmation} onOpenChange={() => {}}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="text-orange-600">Call Declined by Expert</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-2">
                The expert has declined your call request.
                <br />
                <br />
                Click "OK" to close and cancel the call.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={async () => {
                  await confirmExpertDeclinedCall();
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
  }

  // Default: Show CallTypeSelectionModal when isOpen is true
  return (
    <>
      <CallTypeSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        expertName={expertName}
        expertId={expertId}
        expertAuthId={expertAuthId}
        expertPrice={expertPrice}
        onStartCall={handleStartCall}
        walletBalance={walletBalance}
        walletLoading={walletLoading}
        isProcessingPayment={isProcessingPayment}
        setIsProcessingPayment={setIsProcessingPayment}
      />
      
      {/* Processing Payment Loader - shown outside modal so it persists after modal closes */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[999998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background rounded-lg p-8 max-w-sm mx-4 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Processing Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your payment...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Monitor for Razorpay modal and hide loader when it appears */}
      {isProcessingPayment && (
        <RazorpayDetector 
          onRazorpayDetected={() => {
            console.log('✅ Razorpay modal detected, hiding processing loader');
            setIsProcessingPayment(false);
          }}
        />
      )}
    </>
  );
};

export default UserCallInterface;

