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
import { supabase } from '@/lib/supabase';
import CallTypeSelectionModal from './modals/CallTypeSelectionModal';
import CallInterruptionModal from './modals/CallInterruptionModal';

// Component to detect when Razorpay modal is fully loaded and visible
const RazorpayDetector: React.FC<{ onRazorpayDetected: () => void }> = ({ onRazorpayDetected }) => {
  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let iframeLoadHandler: (() => void) | null = null;
    
    const checkRazorpayFullyLoaded = (): boolean => {
      // Check for Razorpay iframe
      const razorpayIframes = document.querySelectorAll(
        'iframe[src*="razorpay"], iframe[src*="checkout.razorpay"]'
      );
      
      // Check for Razorpay container elements
      const razorpayContainers = document.querySelectorAll(
        '[id*="razorpay-checkout"], [class*="razorpay-checkout"], [id*="razorpay"], [class*="razorpay"]'
      );
      
      // Check if iframe is loaded and visible
      let iframeLoaded = false;
      razorpayIframes.forEach((iframe) => {
        const htmlIframe = iframe as HTMLIFrameElement;
        // Check if iframe has loaded content (not just created)
        if (htmlIframe.contentWindow && htmlIframe.contentDocument) {
          // Check if iframe is visible (not hidden)
          const rect = iframe.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0 && 
                          window.getComputedStyle(iframe).display !== 'none' &&
                          window.getComputedStyle(iframe).visibility !== 'hidden' &&
                          window.getComputedStyle(iframe).opacity !== '0';
          
          if (isVisible) {
            iframeLoaded = true;
          }
        }
      });
      
      // Check if containers are visible
      let containerVisible = false;
      razorpayContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && 
                        window.getComputedStyle(container).display !== 'none' &&
                        window.getComputedStyle(container).visibility !== 'hidden' &&
                        window.getComputedStyle(container).opacity !== '0';
        
        if (isVisible) {
          containerVisible = true;
        }
      });
      
      // Razorpay is fully loaded if we have visible iframe or visible container
      return iframeLoaded || containerVisible;
    };
    
    const handleRazorpayDetected = () => {
      // Small delay to ensure Razorpay is fully rendered and visible
      setTimeout(() => {
        console.log('✅ Razorpay modal fully loaded and visible, hiding processing loader');
        onRazorpayDetected();
      }, 300); // 300ms delay to ensure full render
    };
    
    // Check for iframe load events
    const setupIframeLoadListeners = () => {
      const razorpayIframes = document.querySelectorAll(
        'iframe[src*="razorpay"], iframe[src*="checkout.razorpay"]'
      );
      
      razorpayIframes.forEach((iframe) => {
        const htmlIframe = iframe as HTMLIFrameElement;
        if (htmlIframe.contentWindow) {
          // If iframe is already loaded, check immediately
          if (htmlIframe.contentDocument?.readyState === 'complete') {
            if (checkRazorpayFullyLoaded()) {
              handleRazorpayDetected();
              return;
            }
          }
          
          // Listen for iframe load event
          iframeLoadHandler = () => {
            // Wait a bit for Razorpay to render inside iframe
            setTimeout(() => {
              if (checkRazorpayFullyLoaded()) {
                handleRazorpayDetected();
              }
            }, 200);
          };
          
          htmlIframe.addEventListener('load', iframeLoadHandler);
        }
      });
    };
    
    // Check immediately
    if (checkRazorpayFullyLoaded()) {
      handleRazorpayDetected();
      return;
    }
    
    // Setup iframe load listeners
    setupIframeLoadListeners();
    
    // Poll for Razorpay modal appearance (check every 100ms for up to 15 seconds)
    let checkCount = 0;
    const maxChecks = 150; // 15 seconds max
    checkInterval = setInterval(() => {
      checkCount++;
      
      // Re-setup listeners in case new iframes are added
      if (checkCount % 10 === 0) { // Every 1 second
        setupIframeLoadListeners();
      }
      
      if (checkRazorpayFullyLoaded()) {
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        handleRazorpayDetected();
      } else if (checkCount >= maxChecks) {
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        console.warn('⚠️ Razorpay modal not fully loaded after 15 seconds, hiding loader anyway');
        onRazorpayDetected();
      }
    }, 100);
    
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      // Remove iframe load listeners
      const razorpayIframes = document.querySelectorAll(
        'iframe[src*="razorpay"], iframe[src*="checkout.razorpay"]'
      );
      razorpayIframes.forEach((iframe) => {
        const htmlIframe = iframe as HTMLIFrameElement;
        if (iframeLoadHandler && htmlIframe.contentWindow) {
          htmlIframe.removeEventListener('load', iframeLoadHandler);
        }
      });
    };
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
  // Use ref to ensure pendingCallCost is always available in callbacks (even if state is stale)
  const pendingCallCostRef = useRef<{ amount: number; currency: 'INR' | 'EUR' } | null>(null);
  // Track if payment response was received - skip balance check if true
  const paymentResponseReceivedRef = useRef<boolean>(false);

  const {
    isConnecting,
    isInCall,
    callState,
    duration,
    showRejoin,
    wasDisconnected,
    showInterruptionModal,
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
    onExpertAccepted: async (sessionId: string) => {
      // CRITICAL: Check database FIRST before any payment processing
      // This is the most reliable way to prevent duplicate payments
      if (sessionId) {
        try {
          const { data: existingSession, error: sessionCheckError } = await supabase
            .from('call_sessions')
            .select('payment_status, cost, status')
            .eq('id', sessionId)
            .single();

          if (!sessionCheckError && existingSession) {
            // If payment is already paid, SKIP everything
            if (existingSession.payment_status === 'paid') {
              console.log('🚫 PAYMENT ALREADY PROCESSED - Skipping all payment logic', {
                sessionId,
                payment_status: existingSession.payment_status,
                cost: existingSession.cost,
                status: existingSession.status
              });
              // Clear pending cost
              setPendingCallCost(null);
              pendingCallCostRef.current = null;
              return; // EXIT IMMEDIATELY - no payment processing
            }
          }
        } catch (checkError) {
          console.error('❌ Error checking payment status:', checkError);
          // Continue only if we can't check (might be new session)
        }
      }

      // Deduct credits IMMEDIATELY when expert accepts (not when call connects)
      // This ensures full session price is deducted as soon as expert accepts
      // Use sessionId parameter directly instead of callSessionId from state
      
      // Use ref to get the latest pendingCallCost (avoids stale closure issues)
      const costToDeduct = pendingCallCostRef.current || pendingCallCost;
      
      console.log('🔔 onExpertAccepted callback triggered!', {
        sessionId,
        pendingCallCost,
        pendingCallCostRef: pendingCallCostRef.current,
        costToDeduct,
        hasPendingCost: !!costToDeduct,
        selectedDuration,
        expertName
      });
      
      if (costToDeduct && sessionId) {
        try {
          // Validate sessionId is not null/undefined
          if (!sessionId) {
            console.error('❌ sessionId is missing when expert accepted');
            toast.error('Call session ID missing. Cannot deduct credits.');
            return;
          }

          // DOUBLE CHECK: Check again right before deducting (race condition protection)
          const { data: finalCheck, error: finalCheckError } = await supabase
            .from('call_sessions')
            .select('payment_status')
            .eq('id', sessionId)
            .single();

          if (!finalCheckError && finalCheck?.payment_status === 'paid') {
            console.log('🚫 PAYMENT ALREADY PAID (final check) - Skipping deduction', {
              sessionId,
              payment_status: finalCheck.payment_status
            });
            setPendingCallCost(null);
            pendingCallCostRef.current = null;
            return; // Exit - payment already done
          }

          // TRIPLE CHECK: Check if wallet transaction already exists for this session
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const supabaseAny = supabase as any;
          const { data: existingTransaction, error: transactionCheckError } = await supabaseAny
            .from('wallet_transactions')
            .select('id, amount, type')
            .eq('reference_id', sessionId)
            .eq('reference_type', 'call_session')
            .eq('type', 'debit')
            .maybeSingle();

          if (!transactionCheckError && existingTransaction) {
            console.log('🚫 WALLET TRANSACTION ALREADY EXISTS - Skipping deduction', {
              sessionId,
              transactionId: existingTransaction.id,
              amount: existingTransaction.amount,
              type: existingTransaction.type
            });
            // Update payment_status if not already set
            await supabase
              .from('call_sessions')
              .update({ payment_status: 'paid' })
              .eq('id', sessionId);
            setPendingCallCost(null);
            pendingCallCostRef.current = null;
            return; // Exit - transaction already exists
          }

          console.log('💰 Expert accepted - Deducting session price immediately:', {
            amount: costToDeduct.amount,
            currency: costToDeduct.currency,
            callSessionId: sessionId,
            callSessionIdType: typeof sessionId,
            callSessionIdLength: sessionId?.length,
            isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId || ''),
            duration: selectedDuration,
            expertName,
            note: 'Full session price deducted on expert acceptance'
          });
          
          const deductResult = await deductCredits(
            costToDeduct.amount,
            'booking',
            sessionId, // Use sessionId parameter directly (this is a UUID from crypto.randomUUID())
            'call_session',
            `Call with ${expertName} - ${selectedDuration} minutes`,
            costToDeduct.currency
          );
          
          console.log('💰 Deduct result:', deductResult);

          if (!deductResult.success) {
            console.error('❌ Failed to deduct credits:', deductResult.error);
            toast.error('Failed to deduct credits. Call may be disconnected.');
            // Don't disconnect the call, but log the error
          } else {
            console.log('✅ Credits deducted successfully on expert acceptance:', costToDeduct.amount);
            
            // Update call_sessions table with payment_status and ensure cost is set
            try {
              const updateData: {
                payment_status: string;
                cost?: number;
                currency?: string;
                updated_at: string;
              } = {
                payment_status: 'paid',
                updated_at: new Date().toISOString()
              };

              // Ensure cost and currency are set in call_sessions
              if (costToDeduct.amount) {
                updateData.cost = costToDeduct.amount;
              }
              if (costToDeduct.currency) {
                updateData.currency = costToDeduct.currency;
              }

              const { error: updateError } = await supabase
                .from('call_sessions')
                .update(updateData)
                .eq('id', sessionId); // Use sessionId parameter

              if (updateError) {
                console.error('❌ Failed to update call_sessions:', updateError);
                // Don't fail the flow if update fails, but log it
              } else {
                console.log('✅ Call session updated with payment_status: paid');
              }
            } catch (updateErr) {
              console.error('❌ Error updating call_sessions:', updateErr);
              // Don't fail the flow if update fails
            }
            
            // Note: Transaction already has reference_id set (UUID in reference_id column or in metadata)
            // No need to update it later via useEffect since we're passing sessionId directly
            console.log('✅ Transaction created with reference:', {
              transactionId: deductResult.transaction?.id,
              referenceId: deductResult.transaction?.reference_id,
              metadata: deductResult.transaction?.metadata
            });
          }
          
          // Clear pending cost after deduction attempt
          setPendingCallCost(null);
          pendingCallCostRef.current = null;
        } catch (error) {
          console.error('❌ Error deducting credits on expert acceptance:', error);
          toast.error('Failed to deduct credits');
          setPendingCallCost(null);
          pendingCallCostRef.current = null;
        }
      } else {
        console.warn('⚠️ No pending call cost or call session ID when expert accepted', {
          hasPendingCost: !!costToDeduct,
          costToDeduct,
          pendingCallCost,
          pendingCallCostRef: pendingCallCostRef.current,
          hasSessionId: !!sessionId,
          sessionId,
          note: 'This means deduction will not happen. Check if pendingCallCost was cleared or never set.'
        });
        toast.error('Unable to deduct credits: Missing call cost or session ID');
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
      pendingCallCostRef.current = null;
      // Don't call onClose immediately - let user see the end state
      // onClose will be called when user explicitly closes or after a delay
      setTimeout(() => {
        onClose();
      }, 2000); // Close after 2 seconds
    }
  });

  const handleStartCall = async (
    selectedCallType: 'audio' | 'video', 
    duration: number, 
    estimatedCost: number,
    currency: 'INR' | 'EUR',
    paymentResponseReceived?: boolean // Flag to indicate payment response was received
  ) => {
    // Set flag if payment response was received
    if (paymentResponseReceived) {
      paymentResponseReceivedRef.current = true;
      console.log('💰 Payment response received flag set - will skip balance check');
    }
console.log('🔄 Setting modalState to connecting...');
    setModalState('connecting');
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(undefined);
        });
      });
    });
    
    console.log('✅ Modal state updated to connecting, proceeding with call setup...', {
      modalState: 'connecting',
      isOpen,
      willShow: 'ConnectingModal should show now'
    });
    
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
    const costData = { amount: estimatedCost, currency };
    setPendingCallCost(costData);
    pendingCallCostRef.current = costData; // Also store in ref for callback access
    
    // If payment response was received, skip balance check (payment is being verified)
    // Connecting modal is already showing, so don't close it
    if (paymentResponseReceivedRef.current) {
      console.log('💰 Payment response received - skipping balance check, payment verification in progress');
      // Reset the flag after a delay to allow payment verification to complete
      setTimeout(() => {
        paymentResponseReceivedRef.current = false;
      }, 5000);
      
      // Refresh balance in background but don't block
      fetchBalance().then(refreshedBalance => {
        console.log('✅ Wallet balance refreshed after payment:', refreshedBalance);
      }).catch(err => {
        console.warn('⚠️ Could not refresh wallet balance:', err);
      });
      
      // Continue with call setup - balance will be checked when payment verification completes
      // Don't return here - let the call proceed
    } else {
      // Normal flow: check balance before starting call
      console.log('💰 Refreshing wallet balance before starting call...');
      const refreshedBalance = await fetchBalance();
      
      // Wait a moment for balance to update in state (for UI consistency)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use the refreshed wallet balance from the function return value
      // This is more reliable than state which updates asynchronously
      const currentBalance = refreshedBalance || walletBalance || 0;
      
      console.log('💰 Wallet balance check:', {
        currentBalance,
        estimatedCost,
        sufficient: currentBalance >= estimatedCost,
        refreshedBalance,
        walletBalanceState: walletBalance
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
        pendingCallCostRef.current = null;
        return;
      }
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
      pendingCallCostRef.current = null;
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

  const handleInterruptionRejoin = async () => {
    await rejoinCall();
  };

  const handleInterruptionEndCall = async () => {
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
      // IMPORTANT: Don't reset modalState if we're in a call flow
      // Keep connecting/waiting/incall states even when isOpen becomes false
      // Only reset if we're in 'selection' state and not connecting/in call
      if (modalState === 'selection' && !isConnecting && !isInCall) {
        // Already in selection, no need to reset
        // Clear any pending timeout when modal closes
        if (connectingTimeoutRef.current) {
          clearTimeout(connectingTimeoutRef.current);
          connectingTimeoutRef.current = null;
        }
      }
      // If modalState is 'connecting', 'waiting', or 'incall', DO NOTHING - keep the state
      console.log('🔒 Modal closed (isOpen=false) but keeping modalState:', modalState, 'because we are in call flow');
    } else {
      // Modal opened - only reset to selection if we're not in a call flow
      if (modalState === 'selection' || (!isConnecting && !isInCall && modalState !== 'connecting' && modalState !== 'waiting' && modalState !== 'incall')) {
        setModalState('selection');
      }
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

  // Debug: Log current state
  console.log('🔍 UserCallInterface render:', { 
    isOpen, 
    modalState, 
    isConnecting, 
    isInCall, 
    hasCallState: !!callState,
    showInterruptionModal,
    wasDisconnected,
    callStateConnectionState: callState?.client?.connectionState
  });
  
  // Debug: Log when showInterruptionModal changes
  useEffect(() => {
    if (showInterruptionModal) {
      console.log('🚨 USER SIDE: showInterruptionModal is TRUE - modal should be visible!', {
        showInterruptionModal,
        wasDisconnected,
        isInCall,
        hasCallState: !!callState
      });
    }
  }, [showInterruptionModal, wasDisconnected, isInCall, callState]);
  
  // Render appropriate modal based on state
  // Priority: incall > connecting > waiting > selection
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
                    pendingCallCostRef.current = null;
                    await confirmExpertDeclinedCall();
                  }}
                  className="w-full sm:w-auto"
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Call Interruption Modal - High z-index to appear above InCallModal */}
          <CallInterruptionModal
            isOpen={showInterruptionModal}
            onRejoin={handleInterruptionRejoin}
            onEndCall={handleInterruptionEndCall}
            isUser={true}
          />
          
          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 text-xs rounded z-[10001]">
              <div>User Side Debug:</div>
              <div>Modal: {showInterruptionModal ? 'OPEN' : 'CLOSED'}</div>
              <div>Disconnected: {wasDisconnected ? 'YES' : 'NO'}</div>
              <div>In Call: {isInCall ? 'YES' : 'NO'}</div>
              <div>Connection: {callState?.client?.connectionState || 'N/A'}</div>
            </div>
          )}
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

  // Default: Show CallTypeSelectionModal when isOpen is true AND modalState is selection
  // Don't show CallTypeSelectionModal if we're in connecting/waiting/incall state
  return (
    <>
      <CallTypeSelectionModal
        isOpen={isOpen && modalState === 'selection'}
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
      {/* Same loader as AddCreditsDialog - shown when processing payment */}
      {/* z-index is 9999 to be above modals but below Razorpay (which is 999999) */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-semibold">Opening Payment Gateway</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we connect to Razorpay...</p>
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

