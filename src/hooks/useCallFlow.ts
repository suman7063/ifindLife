import { useState, useCallback, useEffect, useRef } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  initiateCall, 
  acceptCall, 
  declineCall, 
  endCall,
  type CallRequestResponse 
} from '@/services/callService';
import { createClient, joinCall, leaveCall, type CallState, type CallType } from '@/utils/agoraService';
import { toast } from 'sonner';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export interface UseCallFlowOptions {
  expertId?: string;
  expertAuthId?: string;
  onCallStarted?: () => void;
  onCallEnded?: () => void;
}

export interface CallFlowState {
  isConnecting: boolean;
  isInCall: boolean;
  callState: CallState | null;
  callSessionId: string | null;
  callRequestId: string | null;
  channelName: string | null;
  agoraToken: string | null;
  agoraUid: number | null;
  callType: CallType | null;
  duration: number;
  error: string | null;
}

export function useCallFlow(options: UseCallFlowOptions = {}) {
  const { user, isAuthenticated } = useSimpleAuth();
  const [flowState, setFlowState] = useState<CallFlowState>({
    isConnecting: false,
    isInCall: false,
    callState: null,
    callSessionId: null,
    callRequestId: null,
    channelName: null,
    agoraToken: null,
    agoraUid: null,
    callType: null,
    duration: 0,
    error: null
  });

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);

  // Start a call (user side)
  const startCall = useCallback(async (
    callType: 'audio' | 'video',
    duration: number,
    expertId: string,
    expertAuthId: string,
    estimatedCost?: number,
    currency?: 'INR' | 'USD' | 'EUR'
  ) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to start a call');
      return false;
    }

    setFlowState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Step 1: Initiate call (creates session, request, and notifications)
      const callData = await initiateCall({
        expertId,
        expertAuthId,
        callType,
        duration,
        userId: user.id,
        userName: user.name || undefined,
        userAvatar: user.profile_picture || undefined,
        estimatedCost,
        currency
      });

      if (!callData) {
        setFlowState(prev => ({ ...prev, isConnecting: false }));
        return false;
      }

      setFlowState(prev => ({
        ...prev,
        callSessionId: callData.callSessionId,
        callRequestId: callData.callRequestId,
        channelName: callData.channelName,
        agoraToken: callData.agoraToken,
        agoraUid: callData.agoraUid,
        callType
      }));

      // Step 2: Wait for expert to accept (poll or use realtime)
      toast.info('Call request sent. Waiting for expert to accept...');

      // Subscribe to call request status changes
      const channel = supabase
        .channel(`call_request_${callData.callRequestId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'incoming_call_requests',
            filter: `id=eq.${callData.callRequestId}`
          },
          async (payload) => {
            const updatedRequest = payload.new as any;
            
            if (updatedRequest.status === 'accepted') {
              // Expert accepted, join the call
              await joinAgoraCall(callData);
            } else if (updatedRequest.status === 'declined') {
              toast.error('Call was declined by the expert');
              setFlowState(prev => ({
                ...prev,
                isConnecting: false,
                isInCall: false,
                error: 'Call declined'
              }));
            }
          }
        )
        .subscribe();

      return true;
    } catch (error) {
      console.error('❌ Error starting call:', error);
      toast.error('Failed to start call');
      setFlowState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      return false;
    }
  }, [isAuthenticated, user]);

  // Join Agora call (after acceptance)
  const joinAgoraCall = useCallback(async (callData: CallRequestResponse) => {
    try {
      console.log('🔗 Joining Agora call...');
      
      const client = createClient();
      clientRef.current = client;

      // Set up event listeners
      client.on('user-published', async (user, mediaType) => {
        console.log('👤 User published:', user.uid, mediaType);
        
        await client.subscribe(user, mediaType);
        
        setFlowState(prev => ({
          ...prev,
          callState: prev.callState ? {
            ...prev.callState,
            remoteUsers: [...prev.callState.remoteUsers.filter(u => u.uid !== user.uid), user]
          } : null
        }));

        // Play remote video if video call
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log('👤 User unpublished:', user.uid, mediaType);
        setFlowState(prev => ({
          ...prev,
          callState: prev.callState ? {
            ...prev.callState,
            remoteUsers: prev.callState.remoteUsers.filter(u => u.uid !== user.uid)
          } : null
        }));
      });

      client.on('user-left', (user) => {
        console.log('👤 User left:', user.uid);
        setFlowState(prev => ({
          ...prev,
          callState: prev.callState ? {
            ...prev.callState,
            remoteUsers: prev.callState.remoteUsers.filter(u => u.uid !== user.uid)
          } : null
        }));
      });

      // Join the call
      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callData.channelName,
          callType: flowState.callType || 'video',
          token: callData.agoraToken,
          uid: callData.agoraUid
        },
        client
      );

      // Play local video if video call
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.play(localVideoRef.current);
      }

      const newCallState: CallState = {
        localAudioTrack,
        localVideoTrack,
        remoteUsers: [],
        client,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: flowState.callType === 'video',
        isAudioEnabled: true
      };

      setFlowState(prev => ({
        ...prev,
        callState: newCallState,
        isConnecting: false,
        isInCall: true
      }));

      callStartTimeRef.current = new Date();
      startDurationTimer();

      toast.success('Connected to call!');
      options.onCallStarted?.();
    } catch (error) {
      console.error('❌ Error joining Agora call:', error);
      toast.error('Failed to join call');
      setFlowState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to join call'
      }));
    }
  }, [flowState.callType, options]);

  // Accept incoming call (expert side)
  const handleAcceptCall = useCallback(async (callRequestId: string) => {
    const success = await acceptCall(callRequestId);
    if (success) {
      toast.success('Call accepted');
    } else {
      toast.error('Failed to accept call');
    }
    return success;
  }, []);

  // Decline incoming call (expert side)
  const handleDeclineCall = useCallback(async (callRequestId: string) => {
    const success = await declineCall(callRequestId);
    if (success) {
      toast.success('Call declined');
    } else {
      toast.error('Failed to decline call');
    }
    return success;
  }, []);

  // End call
  const stopCall = useCallback(async () => {
    try {
      // Leave Agora channel
      if (clientRef.current && flowState.callState?.localAudioTrack) {
        await leaveCall(
          clientRef.current,
          flowState.callState.localAudioTrack,
          flowState.callState.localVideoTrack
        );
      }

      // Stop duration timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      // Calculate duration and end session
      let finalDuration = 0;
      if (callStartTimeRef.current) {
        finalDuration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
      }

      if (flowState.callSessionId) {
        await endCall(flowState.callSessionId, finalDuration);
      }

      // Reset state
      setFlowState({
        isConnecting: false,
        isInCall: false,
        callState: null,
        callSessionId: null,
        callRequestId: null,
        channelName: null,
        agoraToken: null,
        agoraUid: null,
        callType: null,
        duration: 0,
        error: null
      });

      callStartTimeRef.current = null;
      toast.success('Call ended');
      options.onCallEnded?.();
    } catch (error) {
      console.error('❌ Error ending call:', error);
      toast.error('Error ending call');
    }
  }, [flowState, options]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (flowState.callState?.localAudioTrack) {
      const newMutedState = !flowState.callState.isMuted;
      if (newMutedState) {
        flowState.callState.localAudioTrack.setEnabled(false);
      } else {
        flowState.callState.localAudioTrack.setEnabled(true);
      }
      
      setFlowState(prev => ({
        ...prev,
        callState: prev.callState ? {
          ...prev.callState,
          isMuted: newMutedState
        } : null
      }));
    }
  }, [flowState.callState]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (flowState.callState?.localVideoTrack) {
      const newVideoState = !flowState.callState.isVideoEnabled;
      flowState.callState.localVideoTrack.setEnabled(newVideoState);
      
      setFlowState(prev => ({
        ...prev,
        callState: prev.callState ? {
          ...prev.callState,
          isVideoEnabled: newVideoState
        } : null
      }));
    }
  }, [flowState.callState]);

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }

    durationTimerRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const duration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
        setFlowState(prev => ({ ...prev, duration }));
      }
    }, 1000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      if (clientRef.current && flowState.callState?.localAudioTrack) {
        leaveCall(
          clientRef.current,
          flowState.callState.localAudioTrack,
          flowState.callState.localVideoTrack
        );
      }
    };
  }, []);

  return {
    ...flowState,
    startCall,
    handleAcceptCall,
    handleDeclineCall,
    stopCall,
    toggleMute,
    toggleVideo,
    localVideoRef,
    remoteVideoRef
  };
}

