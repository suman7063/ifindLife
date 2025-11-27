/**
 * useCallFlow Hook
 * Main hook for managing user-side call flow
 */

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
  onExpertAccepted?: (callSessionId: string) => void; // Called when expert accepts the call, with callSessionId
  onCallStarted?: () => void; // Called when call actually connects
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
  showRejoin: boolean;
  wasDisconnected: boolean;
  showInterruptionModal: boolean;
  expertEndedCall: boolean;
  showExpertEndCallConfirmation: boolean;
  expertDeclinedCall: boolean;
  showExpertDeclinedCallConfirmation: boolean;
}

export function useCallFlow(options: UseCallFlowOptions = {}) {
  const { user, userProfile, isAuthenticated } = useSimpleAuth();
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
    error: null,
    showRejoin: false,
    wasDisconnected: false,
    showInterruptionModal: false,
    expertEndedCall: false,
    showExpertEndCallConfirmation: false,
    expertDeclinedCall: false,
    showExpertDeclinedCallConfirmation: false
  });

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasBeenConnectedRef = useRef<boolean>(false);
  const reconnectingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paymentProcessedRef = useRef<boolean>(false); // Track if payment already processed
  const isRejoiningRef = useRef<boolean>(false); // Track if we're in the process of rejoining
  const modalShownRef = useRef<boolean>(false); // Track if modal was already shown to prevent duplicates
  const lastModalTriggerTimeRef = useRef<number>(0); // Track last time modal was triggered
  const callActiveStartTimeRef = useRef<number>(0); // Track when call became active (to prevent showing on first connection)

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }

    if (!callStartTimeRef.current) {
      callStartTimeRef.current = new Date();
    }

    const updateDuration = () => {
      if (!callStartTimeRef.current) return;
      
      const now = Date.now();
      const startTime = callStartTimeRef.current.getTime();
      const duration = Math.floor((now - startTime) / 1000);
      
      setFlowState(prev => ({ ...prev, duration }));
    };

    updateDuration();
    durationTimerRef.current = setInterval(updateDuration, 1000);
  }, []);

  // Join Agora call (after acceptance)
  const joinAgoraCall = useCallback(async (callData: CallRequestResponse) => {
    // IMPORTANT: Prevent duplicate joins - check if already in call
    if (flowState.isInCall && flowState.callState?.isJoined) {
      console.log('⚠️ Already joined call, skipping duplicate join');
      return;
    }
    
    // IMPORTANT: If payment already processed, this is a rejoin - don't process payment again
    if (paymentProcessedRef.current) {
      console.log('✅ Rejoin detected (payment already processed), joining call without payment callback');
    }
    
    // Prevent duplicate joins - check if we're already in the process of joining
    if (clientRef.current) {
      const connectionState = clientRef.current.connectionState;
      if (connectionState === 'CONNECTING' || connectionState === 'CONNECTED') {
        console.log('⚠️ Client already exists and is connecting/connected, skipping duplicate join');
        return;
      }
      // If client exists but is disconnected, clean it up first
      console.log('🧹 Cleaning up existing disconnected client before creating new one');
      try {
        await clientRef.current.leave();
      } catch (leaveError) {
        console.warn('⚠️ Error leaving existing client:', leaveError);
      }
      clientRef.current = null;
    }
    
    try {
      console.log('🔗 Joining Agora call...');
      
      const client = createClient();
      clientRef.current = client;

      // Set up connection state listener
      client.on('connection-state-change', (curState, revState) => {
        console.log('📡 Connection state changed:', curState, revState, {
          hasBeenConnected: hasBeenConnectedRef.current,
          isInCall: flowState.isInCall,
          isJoined: flowState.callState?.isJoined
        });
        
        if (curState === 'CONNECTED') {
          hasBeenConnectedRef.current = true;
          
          // IMPORTANT: Track when call becomes active (for first time connection detection)
          if (flowState.isInCall && flowState.callState?.isJoined) {
            if (callActiveStartTimeRef.current === 0) {
              callActiveStartTimeRef.current = Date.now();
              console.log('✅ Call became active - tracking start time:', callActiveStartTimeRef.current);
            }
          } else {
            // Reset if call is not active
            if (callActiveStartTimeRef.current > 0) {
              console.log('🔄 Call no longer active - resetting start time');
              callActiveStartTimeRef.current = 0;
            }
          }
          
          // Clear any reconnecting timeout when connected
          if (reconnectingTimeoutRef.current) {
            clearTimeout(reconnectingTimeoutRef.current);
            reconnectingTimeoutRef.current = null;
          }
          
          // IMPORTANT: If we're rejoining, close modal and reset flags
          if (isRejoiningRef.current) {
            console.log('✅ Rejoin successful - closing modal and resetting flags');
            isRejoiningRef.current = false;
            modalShownRef.current = false; // Reset modal shown flag
            setFlowState(prev => ({
              ...prev,
              showRejoin: false,
              wasDisconnected: false,
              showInterruptionModal: false
            }));
          } else if (flowState.showInterruptionModal && flowState.wasDisconnected) {
            // Don't auto-close - let user manually close via rejoin button
            // Modal will close when user clicks "Yes, Rejoin Call"
            console.log('✅ Connection restored but keeping modal open - user must click Rejoin');
          } else {
            // Normal connection (not from disconnection) - clear immediately
            setFlowState(prev => ({
              ...prev,
              showRejoin: false,
              wasDisconnected: false,
              showInterruptionModal: false
            }));
          }
          wasDisconnectedWhenOfflineRef.current = false; // Reset flag
        } else if (curState === 'RECONNECTING' && hasBeenConnectedRef.current) {
          // IMPORTANT: Don't show modal if we're in the process of rejoining
          if (isRejoiningRef.current) {
            console.log('🔄 Reconnecting during rejoin process - ignoring (modal already shown)');
            return;
          }
          
          // IMPORTANT: Only show modal if we were actually IN a call (not just connecting)
          // Check if call was actually active before showing interruption
          if (!flowState.isInCall || !flowState.callState?.isJoined) {
            console.log('🔄 Reconnecting but call not fully active yet - ignoring');
            return;
          }
          
          // RECONNECTING is normal - Agora is trying to reconnect automatically
          // Mark as disconnected but don't show modal yet - wait for network to come back
          console.log('🔄 Agora is automatically reconnecting (call was active)...');
          wasDisconnectedWhenOfflineRef.current = true;
          
          // Clear any existing timeout
          if (reconnectingTimeoutRef.current) {
            clearTimeout(reconnectingTimeoutRef.current);
          }
          
          // Set timeout to show modal if still reconnecting after 5 seconds
          // But only if network is online (check navigator.onLine)
          reconnectingTimeoutRef.current = setTimeout(() => {
            // Double check: Only show if call was actually active and not rejoining and modal not already shown
            const now = Date.now();
            const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
            const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
            
            // IMPORTANT: Only show modal if call was active for at least 1 second (prevents showing on first connection)
            // And debounce of 2 seconds to prevent duplicates
            if (flowState.isInCall && flowState.callState?.isJoined && navigator.onLine && 
                !isRejoiningRef.current && !modalShownRef.current && timeSinceLastTrigger > 2000 &&
                callActiveDuration > 1000) {
              console.log('⚠️ Still reconnecting after 5 seconds (network online, call was active) - showing interruption modal', {
                callActiveDuration,
                timeSinceLastTrigger,
                allConditions: {
                  isInCall: flowState.isInCall,
                  isJoined: flowState.callState?.isJoined,
                  isOnline: navigator.onLine,
                  isRejoining: isRejoiningRef.current,
                  modalShown: modalShownRef.current
                }
              });
              modalShownRef.current = true;
              lastModalTriggerTimeRef.current = now;
              setFlowState(prev => ({
                ...prev,
                showRejoin: true,
                wasDisconnected: true,
                showInterruptionModal: true
              }));
            } else {
              console.log('⚠️ Still reconnecting but conditions not met - skipping modal', {
                isInCall: flowState.isInCall,
                isJoined: flowState.callState?.isJoined,
                isOnline: navigator.onLine,
                isRejoining: isRejoiningRef.current,
                modalShown: modalShownRef.current,
                timeSinceLastTrigger,
                callActiveDuration,
                needsMoreTime: callActiveDuration <= 1000,
                needsDebounce: timeSinceLastTrigger <= 2000
              });
              wasDisconnectedWhenOfflineRef.current = true;
            }
            reconnectingTimeoutRef.current = null;
          }, 5000); // 5 seconds timeout
        } else if (curState === 'DISCONNECTED' && hasBeenConnectedRef.current) {
          // IMPORTANT: Don't show modal if we're in the process of rejoining
          if (isRejoiningRef.current) {
            console.log('⚠️ Disconnected during rejoin process - ignoring (modal already shown)');
            return;
          }
          
          // IMPORTANT: Only show modal if we were actually IN a call (not just connecting)
          // Check if call was actually active before showing interruption
          if (!flowState.isInCall || !flowState.callState?.isJoined) {
            console.log('⚠️ Disconnected but call not fully active yet - ignoring');
            return;
          }
          
          // Clear reconnecting timeout if we reach DISCONNECTED
          if (reconnectingTimeoutRef.current) {
            clearTimeout(reconnectingTimeoutRef.current);
            reconnectingTimeoutRef.current = null;
          }
          
          // IMPORTANT: Prevent auto-reconnect by leaving the channel
          // User must manually click "Rejoin" button
          console.log('🚫 Preventing auto-reconnect - user must manually rejoin');
          if (clientRef.current) {
            // Leave channel to prevent auto-reconnect (fire and forget)
            clientRef.current.leave().then(() => {
              console.log('✅ Left channel to prevent auto-reconnect');
            }).catch((leaveError) => {
              console.warn('⚠️ Error leaving channel:', leaveError);
            });
          }
          
          // Mark as disconnected
          wasDisconnectedWhenOfflineRef.current = true;
          
          // Only show modal if network is online AND call was actually active AND not already rejoining AND modal not already shown
          // IMPORTANT: Only show if call was active for at least 1 second (prevents showing on first connection)
          // If network is offline, modal will show when network comes back
          const now = Date.now();
          const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
          const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
          
          if (navigator.onLine && flowState.isInCall && flowState.callState?.isJoined && 
              !isRejoiningRef.current && !modalShownRef.current && timeSinceLastTrigger > 2000 &&
              callActiveDuration > 1000) {
            console.log('⚠️ Connection disconnected (network online, call was active) - SHOWING MODAL IMMEDIATELY', {
              callActiveDuration,
              timeSinceLastTrigger,
              allConditions: {
                isOnline: navigator.onLine,
                isInCall: flowState.isInCall,
                isJoined: flowState.callState?.isJoined,
                isRejoining: isRejoiningRef.current,
                modalShown: modalShownRef.current
              }
            });
            modalShownRef.current = true;
            lastModalTriggerTimeRef.current = now;
            setFlowState(prev => ({
              ...prev,
              showRejoin: true,
              wasDisconnected: true,
              showInterruptionModal: true
            }));
          } else {
            console.log('⚠️ Connection disconnected but conditions not met - skipping modal', {
              isOnline: navigator.onLine,
              isInCall: flowState.isInCall,
              isJoined: flowState.callState?.isJoined,
              isRejoining: isRejoiningRef.current,
              modalShown: modalShownRef.current,
              timeSinceLastTrigger,
              callActiveDuration,
              needsMoreTime: callActiveDuration <= 1000,
              needsDebounce: timeSinceLastTrigger <= 2000
            });
            setFlowState(prev => ({
              ...prev,
              wasDisconnected: true
            }));
          }
        } else if (curState === 'RECONNECTING' && !hasBeenConnectedRef.current) {
          // If we're reconnecting but never connected, this is initial connection - don't show modal
          console.log('🔄 Initial connection attempt (not reconnecting)');
        }
      });

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
        if (mediaType === 'video' && remoteVideoRef.current && user.videoTrack) {
          try {
            await user.videoTrack.play(remoteVideoRef.current);
            console.log('✅ Playing remote video track');
          } catch (error) {
            console.warn('⚠️ Could not play remote video:', error);
          }
        }
        
        // Handle remote audio - explicitly configure and play audio track
        // Note: In video calls, audio and video are published separately, so we handle both
        if (mediaType === 'audio' && user.audioTrack) {
          console.log('✅ Remote audio track subscribed');
          try {
            // Set volume for remote audio track (0-100)
            user.audioTrack.setVolume(100);
            
            // CRITICAL: Play remote audio track explicitly
            // Remote audio tracks need to be played on an audio element
            // Create a hidden audio element if it doesn't exist
            let audioElement = document.getElementById(`remote-audio-${user.uid}`) as HTMLAudioElement;
            if (!audioElement) {
              audioElement = document.createElement('audio');
              audioElement.id = `remote-audio-${user.uid}`;
              audioElement.autoplay = true;
              audioElement.setAttribute('playsinline', 'true');
              document.body.appendChild(audioElement);
            }
            
            // Play the remote audio track
            await user.audioTrack.play();
            console.log('✅ Remote audio track played:', {
              volume: 100,
              isPlaying: user.audioTrack.isPlaying || false,
              uid: user.uid
            });
          } catch (audioError) {
            console.warn('⚠️ Could not configure remote audio:', audioError);
            // Try alternative method - set volume and ensure track is enabled
            try {
              if (user.audioTrack) {
                user.audioTrack.setVolume(100);
                console.log('✅ Set remote audio volume as fallback');
              }
            } catch (fallbackError) {
              console.error('❌ Fallback audio configuration failed:', fallbackError);
            }
          }
        }
      });

      client.on('user-unpublished', (user) => {
        console.log('👤 Expert unpublished:', user.uid);
        
        // IMPORTANT: Show info message to user if expert doesn't republish within 5 seconds
        // User's connection is fine, so user doesn't need to rejoin
        // Expert will handle their own rejoin on their side
        
        // Set timeout to show info message if expert doesn't republish
        if (hasBeenConnectedRef.current && flowState.isInCall && flowState.callState?.isJoined) {
          setTimeout(() => {
            setFlowState(currentState => {
              const stillNotPublished = !currentState.callState?.remoteUsers.find(u => u.uid === user.uid);
              if (stillNotPublished && hasBeenConnectedRef.current && currentState.isInCall && currentState.callState?.isJoined) {
                console.log('⚠️ Expert unpublished and not republished - showing info to user');
                toast.info('Expert network issue detected', {
                  description: 'The expert is experiencing network problems. They will rejoin automatically when their connection is restored.',
                  duration: 5000
                });
              }
              return currentState;
            });
          }, 5000); // 5 seconds timeout
        }
        
        setFlowState(prev => ({
          ...prev,
          callState: prev.callState ? {
            ...prev.callState,
            remoteUsers: prev.callState.remoteUsers.filter(u => u.uid !== user.uid)
          } : null
        }));
        
        // Cleanup audio element when expert unpublishes
        const audioElement = document.getElementById(`remote-audio-${user.uid}`);
        if (audioElement) {
          audioElement.remove();
          console.log('✅ Removed remote audio element for expert:', user.uid);
        }
      });

      client.on('user-left', (user) => {
        console.log('👤 Expert left:', user.uid);
        
        // IMPORTANT: Show info message to user when expert disconnects
        // User's connection is fine, so user doesn't need to rejoin
        // Expert will handle their own rejoin on their side
        if (hasBeenConnectedRef.current && flowState.isInCall && flowState.callState?.isJoined) {
          toast.info('Expert network issue detected', {
            description: 'The expert is experiencing network problems. They will rejoin automatically when their connection is restored.',
            duration: 5000
          });
        }
        
        setFlowState(prev => ({
          ...prev,
          expertEndedCall: prev.isInCall && prev.callState?.isJoined ? true : prev.expertEndedCall,
          callState: prev.callState ? {
            ...prev.callState,
            remoteUsers: prev.callState.remoteUsers.filter(u => u.uid !== user.uid)
          } : null
        }));
        
        // Cleanup audio element when expert leaves
        const audioElement = document.getElementById(`remote-audio-${user.uid}`);
        if (audioElement) {
          audioElement.remove();
          console.log('✅ Removed remote audio element for expert:', user.uid);
        }
      });

      // Join the call
      const actualCallType = flowState.callType || 'video';
      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callData.channelName,
            callType: actualCallType,
          token: callData.agoraToken,
          uid: callData.agoraUid
        },
        client
      );

      // Play local video if video call - ensure it plays immediately if ref is ready
        if (localVideoTrack && actualCallType === 'video') {
        // Wait a bit for the modal to render
        setTimeout(async () => {
          if (localVideoRef.current) {
            try {
              // Ensure video is enabled
          if (!localVideoTrack.enabled) {
            localVideoTrack.setEnabled(true);
          }
              await localVideoTrack.play(localVideoRef.current, { mirror: true });
              console.log('✅ Playing local video track (user side)');
          } catch (playError) {
              console.warn('⚠️ Could not play local video (ref may not be ready yet):', playError);
              // The InCallModal useEffect will retry when ref is ready
          }
        } else {
            console.log('📹 Local video track created, waiting for ref to be ready...');
          }
        }, 300);
      }

      const newCallState: CallState = {
        localAudioTrack,
        localVideoTrack,
        remoteUsers: [],
        client,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: actualCallType === 'video',
        isAudioEnabled: true
      };
      
      console.log('✅ Created newCallState:', {
        hasAudioTrack: !!newCallState.localAudioTrack,
        hasVideoTrack: !!newCallState.localVideoTrack,
        isVideoEnabled: newCallState.isVideoEnabled,
        callType: actualCallType
      });

      // Ensure audio is enabled and volume is set AFTER publishing
      // Important: Verify audio track is enabled after state update
      if (localAudioTrack) {
        try {
          // Ensure audio track is enabled
          if (!localAudioTrack.enabled) {
            localAudioTrack.setEnabled(true);
            console.log('✅ Enabled local audio track');
          }
          
          // Set volume to maximum
          localAudioTrack.setVolume(100);
          
          // Verify audio track is ready and transmitting
          console.log('✅ Local audio track configured:', {
            enabled: localAudioTrack.enabled,
            volume: '100%',
            muted: localAudioTrack.muted || false,
            published: true
          });
          
          // Double-check after a short delay to ensure it stays enabled
          setTimeout(() => {
            if (localAudioTrack && !localAudioTrack.enabled) {
              console.warn('⚠️ Audio track was disabled, re-enabling...');
              localAudioTrack.setEnabled(true);
              localAudioTrack.setVolume(100);
            }
          }, 1000);
          
          console.log('✅ Local audio track enabled and volume set to 100');
        } catch (audioError) {
          console.warn('⚠️ Could not configure local audio:', audioError);
        }
      } else {
        console.error('❌ localAudioTrack is null!');
      }

      // Set call start time
      callStartTimeRef.current = new Date();
      hasBeenConnectedRef.current = true;
      
      // IMPORTANT: Mark payment as processed when call successfully connects
      // This ensures that if network reconnects and subscription fires again, payment won't be processed
      if (!paymentProcessedRef.current) {
        console.log('⚠️ Call connected but payment not marked as processed - marking now to prevent duplicates');
        paymentProcessedRef.current = true;
      }

      setFlowState(prev => ({
        ...prev,
        callState: newCallState,
        isConnecting: false,
        isInCall: true,
        duration: 0
      }));

      // Start timer
      startDurationTimer();
      
      // Update session status to active
      try {
        await supabase
          .from('call_sessions')
          .update({ 
            status: 'active',
            start_time: callStartTimeRef.current.toISOString()
          })
          .eq('id', callData.callSessionId);
        console.log('✅ Call session status updated to active');
      } catch (dbError) {
        console.error('❌ Error updating session status:', dbError);
      }

      // Store session info for rejoin
      try {
        sessionStorage.setItem('user_call_session', callData.callSessionId);
        sessionStorage.setItem('user_call_data', JSON.stringify({
          channelName: callData.channelName,
          agoraToken: callData.agoraToken,
          agoraUid: callData.agoraUid,
          callType: actualCallType,
          callRequestId: flowState.callRequestId,
          callSessionId: callData.callSessionId,
          callStartTime: callStartTimeRef.current.toISOString()
        }));
      } catch (storageError) {
        console.warn('⚠️ Failed to store session:', storageError);
      }

      toast.success('Connected to call!');
      
      // Call onCallStarted callback
      setTimeout(() => {
      options.onCallStarted?.();
      }, 0);
    } catch (error) {
      console.error('❌ Error joining Agora call:', error);
      toast.error('Failed to join call: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setFlowState(prev => ({
        ...prev,
        isConnecting: false,
        isInCall: false,
        error: error instanceof Error ? error.message : 'Failed to join call'
      }));
    }
  }, [flowState.callType, flowState.callRequestId, flowState.isInCall, flowState.callState?.isJoined, startDurationTimer, options]);

  // Start a call (user side)
  const startCall = useCallback(async (
    callType: 'audio' | 'video',
    duration: number,
    expertId: string,
    expertAuthId: string,
    estimatedCost?: number,
    currency?: 'INR' | 'EUR'
  ) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to start a call');
      return false;
    }

    setFlowState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Initiate call
      const callData = await initiateCall({
        expertId,
        expertAuthId,
        callType,
        duration,
        userId: user.id,
        userName: userProfile?.name || undefined,
        userAvatar: userProfile?.profile_picture || undefined,
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

      toast.info('Call request sent. Waiting for expert to accept...');

      // Subscribe to call request status changes
      let hasJoinedCall = false;
      
      const channel = supabase
        .channel(`call_request_${callData.callRequestId}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'incoming_call_requests',
            filter: `id=eq.${callData.callRequestId}`
          },
          async (payload) => {
            console.log('📡 Real-time update received:', payload);
            const updatedRequest = payload.new as { status: string };
            
            // IMPORTANT: Check multiple conditions to prevent duplicate processing
            // 1. Check if already joined (local variable)
            // 2. Check if payment already processed (ref)
            // 3. Check if already in call (state)
            if (hasJoinedCall || paymentProcessedRef.current || flowState.isInCall) {
              console.log('⚠️ Already joined/paid/in-call, ignoring duplicate update', {
                hasJoinedCall,
                paymentProcessed: paymentProcessedRef.current,
                isInCall: flowState.isInCall
              });
              return;
            }
            
            if (updatedRequest.status === 'accepted') {
              console.log('✅ Expert accepted via real-time, joining call...');
              
              // IMPORTANT: Only process payment if not already processed (prevent duplicate on rejoin/network reconnect)
              if (!paymentProcessedRef.current && options.onExpertAccepted) {
                try {
                  console.log('💰 Calling onExpertAccepted with callSessionId:', callData.callSessionId);
                  await options.onExpertAccepted(callData.callSessionId);
                  paymentProcessedRef.current = true; // Mark payment as processed
                } catch (error) {
                  console.error('❌ Error in onExpertAccepted callback:', error);
                }
              } else {
                console.log('⚠️ Payment already processed, skipping onExpertAccepted callback');
              }
              
              hasJoinedCall = true;
              await joinAgoraCall(callData);
            } else if (updatedRequest.status === 'declined') {
              console.log('❌ Expert declined via real-time');
              
              // Clean up subscriptions
              if (subscriptionRef.current) {
                await supabase.removeChannel(subscriptionRef.current);
                subscriptionRef.current = null;
              }
              
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              
              // Show confirmation dialog instead of just showing error
              setFlowState(prev => ({
                ...prev,
                isConnecting: false,
                isInCall: false,
                expertDeclinedCall: true,
                showExpertDeclinedCallConfirmation: true,
                error: 'Call declined'
              }));
            }
          }
        )
        .subscribe();

      // Poll as fallback
      const pollInterval = setInterval(async () => {
        try {
          // IMPORTANT: Check multiple conditions to prevent duplicate processing
          // Stop polling if already joined, payment processed, or already in call
          if (hasJoinedCall || paymentProcessedRef.current || flowState.isInCall) {
            console.log('⚠️ Polling: Already joined/paid/in-call, stopping poll', {
              hasJoinedCall,
              paymentProcessed: paymentProcessedRef.current,
              isInCall: flowState.isInCall
            });
            clearInterval(pollInterval);
            return;
          }
          
          const { data: currentRequest } = await supabase
            .from('incoming_call_requests')
            .select('status')
            .eq('id', callData.callRequestId)
            .single();

          // IMPORTANT: Check again before processing (state might have changed)
          if (currentRequest?.status === 'accepted' && !hasJoinedCall && !paymentProcessedRef.current && !flowState.isInCall) {
            console.log('✅ Expert accepted (via polling), joining call...');
            
            // IMPORTANT: Only process payment if not already processed (prevent duplicate on rejoin/network reconnect)
            if (!paymentProcessedRef.current && options.onExpertAccepted) {
              try {
                console.log('💰 Calling onExpertAccepted with callSessionId (polling):', callData.callSessionId);
                await options.onExpertAccepted(callData.callSessionId);
                paymentProcessedRef.current = true; // Mark payment as processed
              } catch (error) {
                console.error('❌ Error in onExpertAccepted callback:', error);
              }
            } else {
              console.log('⚠️ Payment already processed, skipping onExpertAccepted callback');
            }
            
            hasJoinedCall = true;
            clearInterval(pollInterval);
            await joinAgoraCall(callData);
          } else if (currentRequest?.status === 'declined') {
            console.log('❌ Expert declined (via polling)');
            clearInterval(pollInterval);
            
            // Clean up subscriptions
            if (subscriptionRef.current) {
              await supabase.removeChannel(subscriptionRef.current);
              subscriptionRef.current = null;
            }
            
            // Show confirmation dialog instead of just showing error
            setFlowState(prev => ({
              ...prev,
              isConnecting: false,
              isInCall: false,
              expertDeclinedCall: true,
              showExpertDeclinedCallConfirmation: true,
              error: 'Call declined'
            }));
          }
        } catch (pollError) {
          console.error('❌ Error polling call status:', pollError);
        }
      }, 2000);

      subscriptionRef.current = channel;
      pollingIntervalRef.current = pollInterval;

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
  }, [isAuthenticated, user, userProfile?.name, userProfile?.profile_picture, joinAgoraCall, options]);

  // End call
  const stopCall = useCallback(async () => {
    // Reset all flags when call stops
    callActiveStartTimeRef.current = 0;
    modalShownRef.current = false;
    isRejoiningRef.current = false;
    lastModalTriggerTimeRef.current = 0;
    console.log('🛑 Call stopped - resetting all flags');
    
    try {
      console.log('🔴 User ending call...');
      
      // Clean up subscriptions
      if (subscriptionRef.current) {
        await supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      // Stop timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      
      // Calculate duration
      let finalDuration = 0;
      if (callStartTimeRef.current) {
        finalDuration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
      }

      // Update database
      if (flowState.callSessionId) {
        try {
          // Determine disconnection reason: if wasDisconnected is true, it's a network error
          const disconnectionReason = flowState.wasDisconnected ? 'network_error' : 'user_ended';
          await endCall(flowState.callSessionId, finalDuration, 'user', disconnectionReason);
          console.log('✅ Call session updated in database');
        } catch (dbError) {
          console.error('❌ Error updating call session:', dbError);
        }
      }

      // Clear session storage
      sessionStorage.removeItem('user_call_session');
      sessionStorage.removeItem('user_call_data');

      // Stop remote tracks
      if (clientRef.current && flowState.callState?.remoteUsers.length > 0) {
        flowState.callState.remoteUsers.forEach(user => {
          try {
            user.audioTrack?.stop();
            user.videoTrack?.stop();
          } catch (err) {
            console.warn('⚠️ Error stopping remote track:', err);
          }
        });
      }

      // Stop local video track explicitly before leaving (ensures camera is off)
      if (flowState.callState?.localVideoTrack) {
        try {
          console.log('📹 Stopping local video track to turn off camera...');
          // Disable the track first
          flowState.callState.localVideoTrack.setEnabled(false);
          // Stop the track
          flowState.callState.localVideoTrack.stop();
          // Get the underlying MediaStreamTrack and stop it
          const videoStream = flowState.callState.localVideoTrack.getMediaStreamTrack();
          if (videoStream) {
            videoStream.stop();
            console.log('✅ Camera MediaStreamTrack stopped');
          }
          // Close the track
          flowState.callState.localVideoTrack.close();
          console.log('✅ Camera fully turned off');
        } catch (videoStopError) {
          console.warn('⚠️ Error stopping video track:', videoStopError);
          // Fallback: try to stop MediaStreamTrack directly
          try {
            const videoStream = flowState.callState.localVideoTrack.getMediaStreamTrack();
            if (videoStream) {
              videoStream.stop();
              console.log('✅ Fallback: Camera stopped');
            }
          } catch (fallbackError) {
            console.error('❌ Fallback camera stop failed:', fallbackError);
          }
        }
      }

      // Stop local audio track explicitly
      if (flowState.callState?.localAudioTrack) {
        try {
          flowState.callState.localAudioTrack.setEnabled(false);
          flowState.callState.localAudioTrack.stop();
          const audioStream = flowState.callState.localAudioTrack.getMediaStreamTrack();
          if (audioStream) {
            audioStream.stop();
          }
          flowState.callState.localAudioTrack.close();
          console.log('✅ Audio track stopped');
        } catch (audioStopError) {
          console.warn('⚠️ Error stopping audio track:', audioStopError);
        }
      }


      // Leave Agora channel - ensure cleanup happens even if tracks are missing
      if (clientRef.current) {
        try {
          await leaveCall(
            clientRef.current,
            flowState.callState?.localAudioTrack || null,
            flowState.callState?.localVideoTrack || null
          );
          console.log('✅ Successfully left Agora channel');
        } catch (agoraError) {
          console.error('❌ Error leaving Agora call:', agoraError);
          // Force leave as fallback
          try {
            await clientRef.current.leave();
            clientRef.current.removeAllListeners();
          } catch (forceLeaveError) {
            console.error('❌ Force leave failed:', forceLeaveError);
          }
        }
      }

      // Reset state
      hasBeenConnectedRef.current = false;
      paymentProcessedRef.current = false; // Reset payment flag
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
        error: null,
      showRejoin: false,
      wasDisconnected: false,
      showInterruptionModal: false,
      expertEndedCall: false,
      showExpertEndCallConfirmation: false,
      expertDeclinedCall: false,
      showExpertDeclinedCallConfirmation: false
    });

      clientRef.current = null;
      callStartTimeRef.current = null;

      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      toast.success(`Call ended. Duration: ${formatTime(finalDuration)}`, { duration: 3000 });
      options.onCallEnded?.();
    } catch (error) {
      console.error('❌ Error ending call:', error);
      toast.error('Error ending call');
      options.onCallEnded?.();
    }
  }, [flowState, options]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    console.log('🔇 Toggle mute called', {
      hasCallState: !!flowState.callState,
      hasAudioTrack: !!flowState.callState?.localAudioTrack,
      currentMutedState: flowState.callState?.isMuted,
      audioTrackEnabled: flowState.callState?.localAudioTrack?.enabled
    });

    if (!flowState.callState?.localAudioTrack) {
      console.error('❌ Audio track not available in callState');
      toast.error('Audio track not available');
      return;
    }
    
    try {
      const currentMutedState = flowState.callState.isMuted;
      const newMutedState = !currentMutedState;
      console.log('🔇 Toggling mute:', { from: currentMutedState, to: newMutedState });
      
      // Enable/disable the audio track
      const audioTrack = flowState.callState.localAudioTrack;
      audioTrack.setEnabled(!newMutedState);
      
      // Also check if track is muted and unmute if needed
      if (newMutedState) {
        // Muting: disable the track
        console.log('🔇 Muting audio track');
      } else {
        // Unmuting: enable the track and ensure volume is set
        console.log('🔇 Unmuting audio track');
        audioTrack.setVolume(100);
      }
      
      console.log('✅ Audio track enabled state:', audioTrack.enabled, 'Volume:', audioTrack.getVolumeLevel?.() || 'N/A');
      
      // Update state immediately
      setFlowState(prev => {
        if (!prev.callState) {
          console.error('❌ callState is null during mute toggle');
          return prev;
        }
        
        return {
        ...prev,
          callState: {
          ...prev.callState,
          isMuted: newMutedState
          }
        };
      });
      
      toast.success(newMutedState ? 'Microphone muted' : 'Microphone unmuted');
      console.log('✅ Mute state updated successfully');
    } catch (error) {
      console.error('❌ Error toggling mute:', error);
      toast.error('Failed to toggle mute: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [flowState.callState]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (!flowState.callState?.localVideoTrack) {
      toast.error('Video track not available');
      return;
    }
    
    try {
      const newVideoState = !flowState.callState.isVideoEnabled;
      flowState.callState.localVideoTrack.setEnabled(newVideoState);
      
      setFlowState(prev => ({
        ...prev,
        callState: prev.callState ? {
          ...prev.callState,
          isVideoEnabled: newVideoState
        } : null
      }));
    } catch (error) {
      console.error('❌ Error toggling video:', error);
      toast.error('Failed to toggle video');
    }
  }, [flowState.callState]);

  // Rejoin call
  // IMPORTANT: This function only reconnects to the existing Agora call session.
  // It does NOT trigger payment/credit deduction - payment was already processed
  // when the expert first accepted the call (via onExpertAccepted callback).
  const rejoinCall = useCallback(async () => {
    try {
      const storedSession = sessionStorage.getItem('user_call_session');
      const storedData = sessionStorage.getItem('user_call_data');
      
      if (!storedSession || !storedData) {
        toast.error('No call session found to rejoin');
        setFlowState(prev => ({
          ...prev,
          showRejoin: false,
          wasDisconnected: false,
          showInterruptionModal: false
        }));
        return false;
      }

      const callData = JSON.parse(storedData);
      
      // Verify session is still active
      const { data: session } = await supabase
        .from('call_sessions')
        .select('status, start_time, selected_duration')
        .eq('id', storedSession)
        .single();

      if (!session || session.status !== 'active') {
        toast.error('Call session has ended');
        sessionStorage.removeItem('user_call_session');
        sessionStorage.removeItem('user_call_data');
        setFlowState(prev => ({
          ...prev,
          showRejoin: false,
          wasDisconnected: false,
          showInterruptionModal: false
        }));
        return false;
      }

      // Check 10-minute grace window
      if (callData.callStartTime) {
        const callStartTime = new Date(callData.callStartTime);
        const now = new Date();
        const timeDiff = now.getTime() - callStartTime.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        // Check if more than 10 minutes have passed since call start
        if (minutesDiff > 10) {
          toast.error('The grace window for rejoining has expired. The call session has ended.');
          sessionStorage.removeItem('user_call_session');
          sessionStorage.removeItem('user_call_data');
          setFlowState(prev => ({
            ...prev,
            showRejoin: false,
            wasDisconnected: false,
            showInterruptionModal: false
          }));
          return false;
        }
      }

      // Restore call start time
      if (callData.callStartTime) {
        callStartTimeRef.current = new Date(callData.callStartTime);
      }

      // IMPORTANT: Mark payment as already processed for rejoin (prevents duplicate deduction)
      paymentProcessedRef.current = true;
      console.log('✅ Rejoin: Payment already processed, skipping payment callback');

      // Set rejoining flag to prevent duplicate modals
      isRejoiningRef.current = true;
      modalShownRef.current = false; // Reset modal shown flag when rejoining
      console.log('🔄 Starting rejoin process - setting isRejoining flag and resetting modalShown');

      // Close modal immediately to prevent duplicate
      setFlowState(prev => ({
        ...prev,
        showRejoin: false,
        wasDisconnected: false,
        showInterruptionModal: false
      }));

      // Join Agora call (this will NOT trigger onExpertAccepted)
      await joinAgoraCall(callData);

      // Flag will be reset when CONNECTED state is reached
      toast.success('Rejoining call...');
      return true;
    } catch (error) {
      console.error('❌ Error rejoining call:', error);
      toast.error('Failed to rejoin call');
      setFlowState(prev => ({
        ...prev,
        showRejoin: false,
        wasDisconnected: false,
        showInterruptionModal: false
      }));
      return false;
    }
  }, [joinAgoraCall]);

  // Subscribe to call session status changes (to detect when expert ends call)
  useEffect(() => {
    if (!flowState.callSessionId || !flowState.isInCall) {
      return;
    }

    console.log('📡 Setting up real-time subscription for call session:', flowState.callSessionId);
    
    const sessionChannel = supabase
      .channel(`call_session_${flowState.callSessionId}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_sessions',
          filter: `id=eq.${flowState.callSessionId}`
        },
        async (payload) => {
          console.log('📡 Call session status update received:', payload);
          const updatedSession = payload.new as { status: string; end_time?: string };
          
          if (updatedSession.status === 'ended') {
            console.log('🔴 Call ended by expert (detected via real-time)');
            
            // Stop timer
            if (durationTimerRef.current) {
              clearInterval(durationTimerRef.current);
              durationTimerRef.current = null;
            }
            
            // Show confirmation dialog instead of immediately cleaning up
            setFlowState(prev => ({
              ...prev,
              showExpertEndCallConfirmation: true,
              expertEndedCall: true
            }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up call session subscription');
      supabase.removeChannel(sessionChannel);
    };
  }, [flowState.callSessionId, flowState.isInCall, options]);

  // Track if we were disconnected when offline
  const wasDisconnectedWhenOfflineRef = useRef<boolean>(false);

  // Listen for browser online/offline events
  // IMPORTANT: Show popup when network comes back ONLINE (not when it goes offline)
  // Because when offline, user can't do anything anyway. When online, they can rejoin.
  useEffect(() => {
    if (!flowState.isInCall || !hasBeenConnectedRef.current) {
      return;
    }

    const handleOnline = () => {
      console.log('🌐 Browser came back online (user side)');
      
      // IMPORTANT: Only show modal if we were actually IN a call (not just connecting)
      // Check if call was actually active before showing interruption
      // IMPORTANT: Only show if call was active for at least 1 second (prevents showing on first connection)
      const now = Date.now();
      const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
      const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
      
      if ((wasDisconnectedWhenOfflineRef.current || flowState.wasDisconnected) && 
          flowState.isInCall && flowState.callState?.isJoined && 
          !isRejoiningRef.current && !modalShownRef.current && timeSinceLastTrigger > 2000 &&
          callActiveDuration > 1000) {
        console.log('✅ Network back online (call was active) - showing interruption modal so user can rejoin', {
          callActiveDuration,
          timeSinceLastTrigger,
          allConditions: {
            wasDisconnectedWhenOffline: wasDisconnectedWhenOfflineRef.current,
            wasDisconnected: flowState.wasDisconnected,
            isInCall: flowState.isInCall,
            isJoined: flowState.callState?.isJoined,
            isRejoining: isRejoiningRef.current,
            modalShown: modalShownRef.current
          }
        });
        
        // IMPORTANT: Ensure client is left to prevent auto-reconnect
        if (clientRef.current) {
          const currentState = clientRef.current.connectionState;
          if (currentState !== 'DISCONNECTED') {
            console.log('🚫 Leaving channel to prevent auto-reconnect');
            clientRef.current.leave().then(() => {
              console.log('✅ Left channel to prevent auto-reconnect on online');
            }).catch((leaveError) => {
              console.warn('⚠️ Error leaving channel on online:', leaveError);
            });
          }
        }
        
        modalShownRef.current = true;
        lastModalTriggerTimeRef.current = now;
        setFlowState(prev => ({
          ...prev,
          showRejoin: true,
          wasDisconnected: true,
          showInterruptionModal: true
        }));
        wasDisconnectedWhenOfflineRef.current = false; // Reset flag
      } else {
        console.log('⚠️ Network back online but call not active - not showing modal', {
          wasDisconnectedWhenOffline: wasDisconnectedWhenOfflineRef.current,
          wasDisconnected: flowState.wasDisconnected,
          isInCall: flowState.isInCall,
          isJoined: flowState.callState?.isJoined
        });
      }
    };

    const handleOffline = () => {
      console.log('🌐 Browser went offline (user side) - marking as disconnected');
      // Just mark that we were disconnected, don't show modal yet
      // Modal will show when network comes back online
      wasDisconnectedWhenOfflineRef.current = true;
      setFlowState(prev => ({
        ...prev,
        wasDisconnected: true
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flowState.isInCall, flowState.wasDisconnected]);

  // Monitor connection state periodically - additional check for user side
  useEffect(() => {
    if (!flowState.isInCall || !hasBeenConnectedRef.current || !clientRef.current) {
      return;
    }

    const checkConnection = setInterval(() => {
      if (clientRef.current) {
        const connectionState = clientRef.current.connectionState;
        console.log('🔍 Periodic connection check (user side):', connectionState);
        
        // If disconnected or reconnecting for too long, show modal
        // IMPORTANT: Only if call was actually active
        if (connectionState === 'DISCONNECTED' && hasBeenConnectedRef.current && 
            flowState.isInCall && flowState.callState?.isJoined) {
          console.log('🚨 Periodic check: DISCONNECTED (call was active) - showing modal');
          setFlowState(prev => ({
            ...prev,
            showRejoin: true,
            wasDisconnected: true,
            showInterruptionModal: true
          }));
        } else if (connectionState === 'RECONNECTING' && hasBeenConnectedRef.current) {
          // Check how long we've been reconnecting
          // This is a fallback if the timeout didn't fire
          console.log('🔄 Periodic check: Still RECONNECTING');
        }
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(checkConnection);
    };
  }, [flowState.isInCall]);

  // Check on mount if call session is already ended (for page refresh scenario)
  useEffect(() => {
    const checkCallStatus = async () => {
      const storedSession = sessionStorage.getItem('user_call_session');
      if (!storedSession) {
        return;
      }

      try {
        console.log('🔍 Checking call session status on mount:', storedSession);
        const { data: session, error } = await supabase
          .from('call_sessions')
          .select('status, end_time, start_time')
          .eq('id', storedSession)
          .single();

        if (error) {
          console.error('❌ Error checking call status:', error);
          // Clear invalid session
          sessionStorage.removeItem('user_call_session');
          sessionStorage.removeItem('user_call_data');
          return;
        }

        if (session && session.status === 'ended') {
          console.log('🔴 Call session already ended, cleaning up...');
          
          // Stop timer if running
          if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current);
            durationTimerRef.current = null;
          }
          
          // Clear session storage
          sessionStorage.removeItem('user_call_session');
          sessionStorage.removeItem('user_call_data');
          
          // Reset state
          setFlowState(prev => ({
            ...prev,
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
            error: null,
            showRejoin: false,
            wasDisconnected: false,
            showInterruptionModal: false,
            expertEndedCall: true,
            showExpertEndCallConfirmation: false,
            expertDeclinedCall: false,
            showExpertDeclinedCallConfirmation: false
          }));
          
          clientRef.current = null;
          callStartTimeRef.current = null;
          
          console.log('✅ Cleaned up ended call session');
        } else if (session && session.status === 'active') {
          console.log('✅ Call session is still active');
          // Session is active, but we're not in call - this is normal after refresh
          // The user can rejoin if needed
        }
      } catch (error) {
        console.error('❌ Error in checkCallStatus:', error);
      }
    };

    checkCallStatus();
  }, []); // Only run on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      
      if (reconnectingTimeoutRef.current) {
        clearTimeout(reconnectingTimeoutRef.current);
      }
    };
  }, []);

  // Handle expert declined call confirmation - cleanup after user confirms
  const confirmExpertDeclinedCall = useCallback(async () => {
    console.log('✅ User confirmed expert declined call, cleaning up...');
    
    // Clean up subscriptions if still active
    if (subscriptionRef.current) {
      await supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // Clear session storage
    sessionStorage.removeItem('user_call_session');
    sessionStorage.removeItem('user_call_data');
    
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
      error: null,
      showRejoin: false,
      wasDisconnected: false,
      showInterruptionModal: false,
      expertEndedCall: false,
      showExpertEndCallConfirmation: false,
      expertDeclinedCall: true,
      showExpertDeclinedCallConfirmation: false
    });
    
    clientRef.current = null;
    callStartTimeRef.current = null;
    
    // Call the callback
    options.onCallEnded?.();
  }, [options]);

  // Handle expert end call confirmation - cleanup after user confirms
  const confirmExpertEndCall = useCallback(async () => {
    console.log('✅ User confirmed expert ended call, cleaning up...');
    
    // Get current state for cleanup
    const currentState = flowState;
    
    // Leave Agora channel
    if (clientRef.current && currentState.callState?.localAudioTrack) {
      try {
        await leaveCall(
          clientRef.current,
          currentState.callState.localAudioTrack,
          currentState.callState.localVideoTrack
        );
        console.log('✅ Left Agora channel after expert ended call');
      } catch (agoraError) {
        console.error('❌ Error leaving Agora call:', agoraError);
        // Try fallback
        if (clientRef.current) {
          try {
            await clientRef.current.leave();
          } catch (e) {
            console.error('❌ Fallback leave failed:', e);
          }
        }
      }
    }
    
    // Stop remote tracks
    if (currentState.callState?.remoteUsers.length > 0) {
      currentState.callState.remoteUsers.forEach(user => {
        try {
          user.audioTrack?.stop();
          user.videoTrack?.stop();
        } catch (err) {
          console.warn('⚠️ Error stopping remote track:', err);
        }
      });
    }
    
    // Clear session storage
    sessionStorage.removeItem('user_call_session');
    sessionStorage.removeItem('user_call_data');
    
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
      error: null,
      showRejoin: false,
      wasDisconnected: false,
      showInterruptionModal: false,
      expertEndedCall: true,
      showExpertEndCallConfirmation: false,
      expertDeclinedCall: false,
      showExpertDeclinedCallConfirmation: false
    });
    
    clientRef.current = null;
    callStartTimeRef.current = null;
    
    // Call the callback
    options.onCallEnded?.();
  }, [flowState, options]);

  return {
    ...flowState,
    startCall,
    stopCall,
    toggleMute,
    toggleVideo,
    rejoinCall,
    confirmExpertEndCall,
    confirmExpertDeclinedCall,
    localVideoRef,
    remoteVideoRef
  };
}

