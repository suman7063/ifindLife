import { useState, useCallback, useEffect, useRef } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { createClient, joinCall, leaveCall, CallState } from '@/utils/agoraService';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Test hook that bypasses payment verification for testing Agora functionality
export const useTestAgoraCall = (expertId: number, expertPrice: number) => {
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

  // Test call without payment verification
  const startCall = useCallback(async (selectedDuration: number, callType: 'video' | 'voice' = 'video') => {
    if (!isAuthenticated || !userProfile) {
      setCallError('Authentication required');
      return false;
    }

    setIsConnecting(true);
    setCallError(null);

    try {
      console.log('🎯 Starting TEST call flow (no payment)...');
      
      // Generate test channel details
      const testChannelName = `test_session_${Date.now()}_${userProfile.id}`;
      const testUid = Math.floor(Math.random() * 1000000);
      
      console.log('🎥 Starting Agora test call with details:', {
        channelName: testChannelName,
        uid: testUid,
        callType
      });

      // Get Agora token from edge function
      console.log('🔑 Getting Agora token from server...');
      
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-agora-token', {
        body: {
          channelName: testChannelName,
          uid: testUid,
          role: 1, // Publisher role
          expireTime: 3600
        }
      });

      if (tokenError) {
        console.error('❌ Failed to get Agora token:', tokenError);
        throw new Error('Failed to get Agora token: ' + tokenError.message);
      }

      console.log('✅ Got Agora token response:', {
        ...tokenData,
        token: tokenData.token ? '[HIDDEN]' : null,
        tokenType: tokenData.tokenType
      });

      // Validate token response
      if (!tokenData.appId) {
        throw new Error('Invalid token response: missing appId');
      }

      // Initialize Agora client and join call
      const client = createClient();
      clientRef.current = client;

      console.log('🔗 Joining Agora channel with proper token...');
      
      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: testChannelName,
          callType: callType === 'video' ? 'video' : 'audio',
          appId: tokenData.appId,
          token: tokenData.token, // Can be null for testing
          uid: tokenData.uid
        },
        client
      );

      console.log('✅ Successfully joined Agora channel');

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

      // Remaining time timer (for test, make it 10 minutes max)
      const testDuration = Math.min(selectedDuration, 10);
      setRemainingTime(testDuration * 60);
      
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const successMessage = tokenData.tokenType === 'authenticated' 
        ? 'Test call started with authenticated token!' 
        : 'Test call started with null token (testing mode)!';
      
      toast.success(successMessage);
      return true;

    } catch (error) {
      console.error('❌ Error starting test call:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to start test call';
      if (error instanceof Error) {
        if (error.message.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
          errorMessage = 'Agora gateway error - check token generation and network';
        } else if (error.message.includes('token')) {
          errorMessage = 'Token generation failed - check Agora configuration';
        } else {
          errorMessage = error.message;
        }
      }
      
      setCallError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, userProfile, expertId, expertPrice]);

  // End call
  const endCall = useCallback(async () => {
    try {
      console.log('🛑 Ending test call...');

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
      
      toast.success('Test call ended');
      return { success: true, cost };

    } catch (error) {
      console.error('❌ Error ending test call:', error);
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
