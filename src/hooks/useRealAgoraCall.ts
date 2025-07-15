import { useState, useCallback, useEffect, useRef } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createClient, joinCall, leaveCall, CallState } from '@/utils/agoraService';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';

export const useRealAgoraCall = (expertId: number, expertPrice: number) => {
  const [callState, setCallState] = useState<CallState | null>(null);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [callError, setCallError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { isAuthenticated, userProfile } = useSimpleAuth();
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start call with payment and Agora integration
  const startCall = useCallback(async (selectedDuration: number, callType: 'video' | 'voice' = 'video') => {
    if (!isAuthenticated || !userProfile) {
      setCallError('Authentication required');
      return false;
    }

    setIsConnecting(true);
    setCallError(null);

    try {
      console.log('🎯 Starting paid call flow...');
      
      // Step 1: Create Razorpay order for call payment
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: selectedDuration * expertPrice * 100, // Amount in paise
          currency: 'INR',
          expertId: expertId,
          description: `Video call with expert - ${selectedDuration} minutes`,
          callSessionId: true // Indicates this is for a call session
        }
      });

      if (orderError || !orderData) {
        throw new Error('Failed to create payment order');
      }

      console.log('💳 Payment order created:', orderData);

      // Step 2: Process payment with Razorpay
      const paymentResult = await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: orderData.razorpayKeyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Expert Call',
            description: `${callType} call with expert`,
            order_id: orderData.id,
            prefill: {
              name: userProfile.name || '',
              email: userProfile.email || ''
            },
            handler: async (response: any) => {
              try {
                // Verify payment
                const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    callSessionId: true
                  }
                });

                if (verifyError || !verifyData.success) {
                  throw new Error('Payment verification failed');
                }

                console.log('✅ Payment verified, got call details:', verifyData);
                resolve(verifyData);
              } catch (error) {
                reject(error);
              }
            },
            modal: {
              ondismiss: () => {
                reject(new Error('Payment cancelled'));
              }
            }
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      });

      const callDetails = paymentResult as any;
      console.log('🎥 Starting Agora call with details:', callDetails);

      // Step 3: Initialize Agora client and join call
      const client = createClient();
      clientRef.current = client;

      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callDetails.channelName,
          callType: callType === 'video' ? 'video' : 'audio',
          appId: callDetails.appId
        },
        client
      );

      // Set call state
      setCallState({
        localAudioTrack,
        localVideoTrack,
        remoteUsers: [],
        client,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: callType === 'video',
        isAudioEnabled: true
      });

      // Start timers
      setDuration(0);
      setRemainingTime(selectedDuration * 60);
      setCost(selectedDuration * expertPrice);

      // Duration timer
      durationTimerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Remaining time timer
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success('Call started successfully!');
      return true;

    } catch (error) {
      console.error('❌ Error starting call:', error);
      setCallError(error instanceof Error ? error.message : 'Failed to start call');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, userProfile, expertId, expertPrice]);

  // End call
  const endCall = useCallback(async () => {
    try {
      console.log('🛑 Ending call...');

      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      // Leave Agora channel
      if (clientRef.current && callState) {
        await leaveCall(
          clientRef.current,
          callState.localAudioTrack,
          callState.localVideoTrack
        );
      }

      // Reset state
      setCallState(null);
      clientRef.current = null;
      
      toast.success('Call ended');
      return { success: true, cost };

    } catch (error) {
      console.error('❌ Error ending call:', error);
      return { success: false, cost: 0 };
    }
  }, [callState, cost]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    if (callState?.localAudioTrack) {
      const newMuted = !callState.isMuted;
      callState.localAudioTrack.setEnabled(!newMuted);
      setCallState(prev => prev ? { ...prev, isMuted: newMuted } : prev);
    }
  }, [callState]);

  const handleToggleVideo = useCallback(() => {
    if (callState?.localVideoTrack) {
      const newEnabled = !callState.isVideoEnabled;
      callState.localVideoTrack.setEnabled(newEnabled);
      setCallState(prev => prev ? { ...prev, isVideoEnabled: newEnabled } : prev);
    }
  }, [callState]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    isConnecting,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    formatTime
  };
};