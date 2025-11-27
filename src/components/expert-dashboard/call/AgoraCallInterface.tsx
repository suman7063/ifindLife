/**
 * Agora Call Interface (Expert Side)
 * Expert-side call interface component
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  MessageSquareOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  createClient, 
  joinCall, 
  leaveCall, 
  type CallState,
  type CallType 
} from '@/utils/agoraService';
import CallChat from '@/components/call/CallChat';
import { AGORA_CONFIG } from '@/utils/agoraConfig';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { endCall } from '@/services/callService';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import CallInterruptionModal from '@/components/call/modals/CallInterruptionModal';

interface UserMetadata {
  name?: string;
  avatar?: string | null;
  user_id?: string;
  [key: string]: unknown;
}

interface AgoraCallInterfaceProps {
  callRequest: {
    id: string;
    user_id: string;
    call_type: 'audio' | 'video';
    channel_name: string;
    agora_token: string | null;
    agora_uid: number | null;
    user_metadata: UserMetadata;
    call_session_id?: string | null;
  };
  onCallEnd: () => void;
}

const AgoraCallInterface: React.FC<AgoraCallInterfaceProps> = ({
  callRequest,
  onCallEnd
}) => {
  const [callState, setCallState] = useState<CallState>({
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    client: null,
    isJoined: false,
    isMuted: false,
    isVideoEnabled: callRequest.call_type === 'video',
    isAudioEnabled: true
  });
  
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wasDisconnected, setWasDisconnected] = useState(false);
  const [showInterruptionModal, setShowInterruptionModal] = useState(false);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  const [showEndCallReasonConfirm, setShowEndCallReasonConfirm] = useState(false);
  const [disconnectionReason, setDisconnectionReason] = useState<string>('');
  const [showUserEndCallConfirmation, setShowUserEndCallConfirmation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const hasBeenConnectedRef = useRef<boolean>(false);
  const reconnectingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userDisconnectedRef = useRef<boolean>(false);
  const userActivityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserActivityRef = useRef<Date | null>(null);
  const wasDisconnectedWhenOfflineRef = useRef<boolean>(false);
  const isRejoiningRef = useRef<boolean>(false); // Track if we're in the process of rejoining
  const modalShownRef = useRef<boolean>(false); // Track if modal was already shown to prevent duplicates
  const lastModalTriggerTimeRef = useRef<number>(0); // Track last time modal was triggered
  const callActiveStartTimeRef = useRef<number>(0); // Track when call became active (to prevent showing on first connection)
  const { expert } = useSimpleAuth();
  const expertName = expert?.name || 'Expert';

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start duration timer
  const startDurationTimer = useCallback((startTime?: Date) => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }

    const actualStartTime = startTime || callStartTime || new Date();
    if (!callStartTime && !startTime) {
      setCallStartTime(actualStartTime);
    }

    const updateDuration = () => {
      const now = Date.now();
      const startTimeMs = actualStartTime.getTime();
      const duration = Math.floor((now - startTimeMs) / 1000);
      setCallDuration(duration);
    };

    updateDuration();
    durationTimerRef.current = setInterval(updateDuration, 1000);
  }, [callStartTime]);

  // Join the Agora call
  const handleJoinCall = async () => {
    try {
      // Prevent duplicate joins - check if we're already in the process of joining
      if (clientRef.current) {
        const connectionState = clientRef.current.connectionState;
        if (connectionState === 'CONNECTING' || connectionState === 'CONNECTED') {
          console.log('⚠️ Expert: Client already exists and is connecting/connected, skipping duplicate join');
          return;
        }
        // If client exists but is disconnected, clean it up first
        console.log('🧹 Expert: Cleaning up existing disconnected client before creating new one');
        try {
          await clientRef.current.leave();
        } catch (leaveError) {
          console.warn('⚠️ Expert: Error leaving existing client:', leaveError);
        }
        clientRef.current = null;
      }

      setIsConnecting(true);
      console.log('🔗 Expert joining Agora call...', {
        channel_name: callRequest.channel_name,
        call_type: callRequest.call_type,
        has_token: !!callRequest.agora_token,
        has_uid: !!callRequest.agora_uid,
        call_session_id: callRequest.call_session_id
      });

      let token = callRequest.agora_token;
      const uid = callRequest.agora_uid || Math.floor(Math.random() * 1000000);
      
      // Generate token if missing
      if (!token || token === 'null' || token === '' || token === 'undefined') {
        console.log('🔄 Token missing, generating new token...');
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('smooth-action', {
          body: {
            channelName: callRequest.channel_name,
            uid: uid,
            role: 1,
            expireTime: 3600
          }
        });

        if (tokenError) {
          console.error('❌ Failed to generate token:', tokenError);
          toast.error('Failed to generate call token');
          setIsConnecting(false);
          return;
        }

        token = tokenData?.token || null;
        console.log('✅ Generated new token');
      }

      const client = createClient();
      clientRef.current = client;

      // Track connection state changes for network disconnection detection
      client.on('connection-state-change', (curState, revState) => {
        console.log('📡 Expert connection state changed:', curState, revState);
        if (curState === 'CONNECTED') {
          hasBeenConnectedRef.current = true;
          
          // IMPORTANT: Track when call becomes active (for first time connection detection)
          if (callState.isJoined) {
            if (callActiveStartTimeRef.current === 0) {
              callActiveStartTimeRef.current = Date.now();
              console.log('✅ Expert call became active - tracking start time:', callActiveStartTimeRef.current);
            }
          } else {
            // Reset if call is not active
            if (callActiveStartTimeRef.current > 0) {
              console.log('🔄 Expert call no longer active - resetting start time');
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
            console.log('✅ Expert rejoin successful - closing modal and resetting flags');
            isRejoiningRef.current = false;
            modalShownRef.current = false; // Reset modal shown flag
            setWasDisconnected(false);
            setShowInterruptionModal(false);
          } else if (showInterruptionModal && wasDisconnected) {
            // Don't auto-close - let expert manually close via rejoin button
            // Modal will close when expert clicks "Yes, Rejoin Call"
            console.log('✅ Expert connection restored but keeping modal open - expert must click Rejoin');
          } else {
            // Normal connection (not from disconnection) - clear immediately
            setWasDisconnected(false);
            setShowInterruptionModal(false);
          }
        } else if (curState === 'RECONNECTING' && hasBeenConnectedRef.current) {
          // IMPORTANT: Don't show modal if we're in the process of rejoining
          if (isRejoiningRef.current) {
            console.log('🔄 Expert reconnecting during rejoin process - ignoring (modal already closed)');
            return;
          }
          
          // IMPORTANT: Only show modal if expert's call was actually active
          // Check if call was actually active before showing interruption
          if (!callState.isJoined) {
            console.log('🔄 Reconnecting but call not fully active yet - ignoring');
            return;
          }
          
          // RECONNECTING is normal - Agora is trying to reconnect automatically
          // Mark as disconnected but don't show modal yet - wait for network to come back
          console.log('🔄 Expert connection reconnecting (call was active)...');
          wasDisconnectedWhenOfflineRef.current = true;
          
          // Clear any existing timeout
          if (reconnectingTimeoutRef.current) {
            clearTimeout(reconnectingTimeoutRef.current);
          }
          
          // Set timeout to show modal if still reconnecting after 5 seconds
          // But only if network is online AND call was active AND not rejoining AND modal not already shown
          // IMPORTANT: Only show if call was active for at least 1 second (prevents showing on first connection)
          reconnectingTimeoutRef.current = setTimeout(() => {
            const now = Date.now();
            const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
            const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
            
            if (navigator.onLine && callState.isJoined && !isRejoiningRef.current && 
                !modalShownRef.current && timeSinceLastTrigger > 2000 && callActiveDuration > 1000) {
              console.log('⚠️ Expert still reconnecting after 5 seconds (network online, call was active) - showing interruption modal', {
                callActiveDuration,
                timeSinceLastTrigger,
                allConditions: {
                  isOnline: navigator.onLine,
                  isJoined: callState.isJoined,
                  isRejoining: isRejoiningRef.current,
                  modalShown: modalShownRef.current
                }
              });
              modalShownRef.current = true;
              lastModalTriggerTimeRef.current = now;
              setWasDisconnected(true);
              setShowInterruptionModal(true);
            } else {
              console.log('⚠️ Expert still reconnecting but conditions not met - skipping modal', {
                isOnline: navigator.onLine,
                isJoined: callState.isJoined,
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
            console.log('⚠️ Expert disconnected during rejoin process - ignoring (modal already closed)');
            return;
          }
          
          // IMPORTANT: Only show modal if expert's call was actually active
          // Check if call was actually active before showing interruption
          if (!callState.isJoined) {
            console.log('⚠️ Expert disconnected but call not fully active yet - ignoring', {
              isJoined: callState.isJoined
            });
            return;
          }
          
          // IMPORTANT: If callActiveStartTimeRef is 0, set it now (fallback for edge cases)
          if (callActiveStartTimeRef.current === 0) {
            callActiveStartTimeRef.current = Date.now() - 5000; // Assume call was active for at least 5 seconds
            console.log('⚠️ Expert callActiveStartTimeRef was 0, setting fallback value');
          }
          
          // Clear reconnecting timeout if we reach DISCONNECTED
          if (reconnectingTimeoutRef.current) {
            clearTimeout(reconnectingTimeoutRef.current);
            reconnectingTimeoutRef.current = null;
          }
          
          // IMPORTANT: Prevent auto-reconnect by leaving the channel
          // Expert must manually click "Rejoin" button
          console.log('🚫 Preventing auto-reconnect - expert must manually rejoin');
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
          
          // Only show modal if network is online AND call was active AND not already rejoining AND modal not already shown
          // IMPORTANT: Only show if call was active for at least 1 second (prevents showing on first connection)
          // If network is offline, modal will show when network comes back
          const now = Date.now();
          const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
          const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
          
          if (navigator.onLine && callState.isJoined && !isRejoiningRef.current && 
              !modalShownRef.current && timeSinceLastTrigger > 2000 && callActiveDuration > 1000) {
            console.log('⚠️ Expert connection disconnected (network online, call was active) - SHOWING MODAL IMMEDIATELY', {
              callActiveDuration,
              timeSinceLastTrigger,
              allConditions: {
                isOnline: navigator.onLine,
                isJoined: callState.isJoined,
                isRejoining: isRejoiningRef.current,
                modalShown: modalShownRef.current
              }
            });
            modalShownRef.current = true;
            lastModalTriggerTimeRef.current = now;
            setWasDisconnected(true);
            setShowInterruptionModal(true);
          } else {
            console.log('⚠️ Expert connection disconnected but conditions not met - skipping modal', {
              isOnline: navigator.onLine,
              isJoined: callState.isJoined,
              isRejoining: isRejoiningRef.current,
              modalShown: modalShownRef.current,
              timeSinceLastTrigger,
              callActiveDuration,
              needsMoreTime: callActiveDuration <= 1000,
              needsDebounce: timeSinceLastTrigger <= 2000
            });
            setWasDisconnected(true);
          }
        }
      });

      // Set up event listeners
      client.on('user-published', async (user, mediaType) => {
        console.log('👤 User published:', user.uid, mediaType);
        
        // Update last activity time
        lastUserActivityRef.current = new Date();
        
        // If user republishes after disconnection, clear the interruption modal
        if (userDisconnectedRef.current) {
          console.log('✅ User republished - clearing interruption modal');
          userDisconnectedRef.current = false;
          setWasDisconnected(false);
          setShowInterruptionModal(false);
        }
        
        await client.subscribe(user, mediaType);
        
        setCallState(prev => {
          const hasUser = prev.remoteUsers.find(u => u.uid === user.uid);
          if (!hasUser) {
            console.log('✅ User joined/republished - clearing any interruption modal');
            userDisconnectedRef.current = false;
            setWasDisconnected(false);
            setShowInterruptionModal(false);
          }
          
          return {
            ...prev,
            remoteUsers: [...prev.remoteUsers.filter(u => u.uid !== user.uid), user]
          };
        });

        // Play remote video if video call
        if (mediaType === 'video' && remoteVideoRef.current && user.videoTrack) {
          try {
            await user.videoTrack.play(remoteVideoRef.current);
            console.log('✅ Playing remote video track (expert side)');
          } catch (error) {
            console.warn('⚠️ Could not play remote video:', error);
          }
        }
        
        // Handle remote audio - explicitly configure and play audio track
        // Note: In video calls, audio and video are published separately, so we handle both
        if (mediaType === 'audio' && user.audioTrack) {
          console.log('✅ Remote audio track subscribed (expert side)');
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
            console.log('✅ Remote audio track played (expert side):', {
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
                console.log('✅ Set remote audio volume as fallback (expert side)');
              }
            } catch (fallbackError) {
              console.error('❌ Fallback audio configuration failed (expert side):', fallbackError);
            }
          }
        }
      });

      client.on('user-unpublished', (user) => {
        console.log('👤 User unpublished:', user.uid);
        
        // IMPORTANT: Don't show popup to expert when user unpublishes
        // But show info message if user doesn't republish within 5 seconds
        // Expert's connection is fine, so expert doesn't need to rejoin
        // User will handle their own rejoin on their side
        
        // Set timeout to show info message if user doesn't republish
        if (hasBeenConnectedRef.current && callState.isJoined) {
          setTimeout(() => {
            setCallState(currentState => {
              const stillNotPublished = !currentState.remoteUsers.find(u => u.uid === user.uid);
              if (stillNotPublished && hasBeenConnectedRef.current && currentState.isJoined) {
                console.log('⚠️ User unpublished and not republished - showing info to expert');
                toast.info('User network issue detected', {
                  description: 'The user is experiencing network problems. They will rejoin automatically when their connection is restored.',
                  duration: 5000
                });
              }
              return currentState;
            });
          }, 5000); // 5 seconds timeout
        }
        
        setCallState(prev => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
        }));
        
        // Cleanup audio element when user unpublishes
        const audioElement = document.getElementById(`remote-audio-${user.uid}`);
        if (audioElement) {
          audioElement.remove();
          console.log('✅ Removed remote audio element for user:', user.uid);
        }
      });

      client.on('user-left', (user) => {
        console.log('👤 User left:', user.uid);
        
        // IMPORTANT: Don't show popup to expert when user leaves
        // But show info message that user has network problem
        // Expert's connection is fine, so expert doesn't need to rejoin
        // User will handle their own rejoin on their side
        
        // Show info message to expert
        if (hasBeenConnectedRef.current && callState.isJoined) {
          toast.info('User network issue detected', {
            description: 'The user is experiencing network problems. They will rejoin automatically when their connection is restored.',
            duration: 5000
          });
        }
        
        setCallState(prev => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
        }));
        
        // Cleanup audio element when user leaves
        const audioElement = document.getElementById(`remote-audio-${user.uid}`);
        if (audioElement) {
          audioElement.remove();
          console.log('✅ Removed remote audio element for user:', user.uid);
        }
      });

      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callRequest.channel_name,
          callType: callRequest.call_type,
          token: token,
          uid: uid
        },
        client
      );

      console.log('✅ Successfully joined Agora channel:', {
        channelName: callRequest.channel_name,
        hasAudioTrack: !!localAudioTrack,
        hasVideoTrack: !!localVideoTrack,
        uid
      });
      
      // Play local video if video call
      if (localVideoTrack && callRequest.call_type === 'video' && localVideoRef.current) {
        try {
          localVideoTrack.play(localVideoRef.current, { mirror: true });
          console.log('✅ Playing local video track (expert side)');
        } catch (playError) {
          console.warn('⚠️ Could not play local video:', playError);
        }
      }

      const newCallState: CallState = {
        localAudioTrack,
        localVideoTrack,
        remoteUsers: [],
        client,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: callRequest.call_type === 'video',
        isAudioEnabled: true
      };

      setCallState(newCallState);
      setIsConnecting(false);
      const startTime = new Date();
      setCallStartTime(startTime);
      currentSessionIdRef.current = callRequest.call_session_id || null;
      console.log('✅ Call joined - Session ID set to:', currentSessionIdRef.current);
      console.log('✅ Call request session ID:', callRequest.call_session_id);

      // Subscribe to call session status changes (to detect when user ends call)
      if (currentSessionIdRef.current) {
        console.log('📡 Setting up real-time subscription for call session (expert side):', currentSessionIdRef.current);
        
        const sessionChannel = supabase
          .channel(`call_session_expert_${currentSessionIdRef.current}_${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'call_sessions',
              filter: `id=eq.${currentSessionIdRef.current}`
            },
            async (payload) => {
              console.log('📡 Call session status update received (expert side):', payload);
              const updatedSession = payload.new as { status: string; end_time?: string };
              
              if (updatedSession.status === 'ended') {
                console.log('🔴 Call ended by user (detected via real-time)');
                
                // Stop timer
                if (durationTimerRef.current) {
                  clearInterval(durationTimerRef.current);
                  durationTimerRef.current = null;
                }
                
                // Show confirmation dialog instead of immediately cleaning up
                setShowUserEndCallConfirmation(true);
              }
            }
          )
          .subscribe();

        sessionChannelRef.current = sessionChannel;
      }

      // Ensure audio is enabled and volume is set AFTER publishing
      if (localAudioTrack) {
        try {
          // Ensure audio track is enabled
          if (!localAudioTrack.enabled) {
            localAudioTrack.setEnabled(true);
            console.log('✅ Enabled local audio track (expert side)');
          }
          
          // Set volume to maximum
          localAudioTrack.setVolume(100);
          
          // Verify audio track is ready and transmitting
          console.log('✅ Local audio track configured (expert side):', {
            enabled: localAudioTrack.enabled,
            volume: '100%',
            muted: localAudioTrack.muted || false,
            published: true
          });
          
          // Double-check after a short delay to ensure it stays enabled
          setTimeout(() => {
            if (localAudioTrack && !localAudioTrack.enabled) {
              console.warn('⚠️ Audio track was disabled, re-enabling... (expert side)');
              localAudioTrack.setEnabled(true);
              localAudioTrack.setVolume(100);
            }
          }, 1000);
          
          console.log('✅ Local audio track enabled and volume set to 100 (expert side)');
        } catch (audioError) {
          console.warn('⚠️ Could not configure local audio:', audioError);
        }
      } else {
        console.error('❌ localAudioTrack is null! (expert side)');
      }

      // Update session status to active
      if (callRequest.call_session_id) {
        try {
          await supabase
            .from('call_sessions')
            .update({ 
              status: 'active',
              start_time: startTime.toISOString()
            })
            .eq('id', callRequest.call_session_id);
          console.log('✅ Call session status updated to active');
        } catch (dbError) {
          console.error('❌ Error updating session status:', dbError);
        }
      }

      // Start timer with the actual start time
      startDurationTimer(startTime);

      toast.success('Connected to call successfully');
    } catch (error) {
      console.error('❌ Error joining call:', error);
      setIsConnecting(false);
      toast.error('Failed to join call: ' + (error as Error).message);
    }
  };

  // Leave the call
  const handleLeaveCall = async () => {
    console.log('🔴 ========== EXPERT ENDING CALL ==========');
    console.log('🔴 Step 1: handleLeaveCall function called');
    
    try {
      // Close confirmation dialog immediately
      setShowEndCallConfirm(false);
      console.log('🔴 Step 2: Dialog closed');
      
      // Calculate duration
      let finalDuration = 0;
      if (callStartTime) {
        finalDuration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
      }

      console.log('🔴 Step 3: Duration calculated:', finalDuration, 'seconds');
      console.log('🔴 Step 4: Session ID:', currentSessionIdRef.current);
      console.log('🔴 Step 5: Client exists:', !!clientRef.current);
      console.log('🔴 Step 6: Is joined:', callState.isJoined);

      // Update database FIRST (most important)
      if (currentSessionIdRef.current) {
        try {
          console.log('🔴 Step 7: Updating database...');
          // Use the selected disconnection reason, or default to 'expert_ended' if network error
          const finalDisconnectionReason = wasDisconnected 
            ? 'network_error' 
            : (disconnectionReason === 'user_misbehaving' 
                ? 'user_misbehaving' 
                : disconnectionReason === 'expert_emergency' 
                  ? 'expert_emergency' 
                  : 'expert_ended');
          const result = await endCall(currentSessionIdRef.current, finalDuration, 'expert', finalDisconnectionReason as any);
          console.log('🔴 Step 8: Database update result:', result);
          if (!result) {
            console.error('❌ Database update returned false!');
          }
        } catch (dbError) {
          console.error('❌ Step 7 FAILED - Database error:', dbError);
          // Continue anyway - try to leave channel
        }
      } else {
        console.error('❌ Step 7 SKIPPED - No session ID!');
        console.error('❌ Call request:', callRequest);
        console.error('❌ Call session ID from request:', callRequest.call_session_id);
      }

      // Stop remote tracks
      if (callState.remoteUsers.length > 0) {
        console.log('🛑 Stopping', callState.remoteUsers.length, 'remote user tracks');
        callState.remoteUsers.forEach(user => {
          try {
            user.audioTrack?.stop();
            user.videoTrack?.stop();
          } catch (err) {
            console.warn('⚠️ Error stopping remote track:', err);
          }
        });
      }

      // Leave Agora channel - try to leave even if tracks are missing
      console.log('🔴 Step 9: Attempting to leave Agora channel...');
      if (clientRef.current) {
        try {
          console.log('🔴 Step 9a: Calling leaveCall function...');
          await leaveCall(
            clientRef.current,
            callState.localAudioTrack,
            callState.localVideoTrack
          );
          console.log('🔴 Step 9b: Successfully left Agora channel');
        } catch (agoraError) {
          console.error('❌ Step 9a FAILED - Agora error:', agoraError);
          // Try to leave without tracks if leaveCall failed
          try {
            console.log('🔴 Step 9c: Attempting fallback channel leave...');
            await clientRef.current.leave();
            console.log('🔴 Step 9d: Left channel via fallback');
          } catch (leaveError) {
            console.error('❌ Step 9c FAILED - Fallback leave error:', leaveError);
          }
        }
      } else {
        console.warn('⚠️ Step 9 SKIPPED - No Agora client available');
      }

      // Stop timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
        console.log('⏱️ Timer stopped');
      }

      // Reset call state
      console.log('🔄 Resetting call state...');
      setCallState({
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: [],
        client: null,
        isJoined: false,
        isMuted: false,
        isVideoEnabled: false,
        isAudioEnabled: false
      });

      // Clear refs
      clientRef.current = null;
      currentSessionIdRef.current = null;
      setCallStartTime(null);
      setCallDuration(0);
      setShowInterruptionModal(false);
      setDisconnectionReason(''); // Reset disconnection reason
      hasBeenConnectedRef.current = false;
      console.log('🧹 All refs cleared');

      console.log('🔴 Step 10: All cleanup done, showing toast and calling onCallEnd');
      toast.success(`Call ended. Duration: ${formatDuration(finalDuration)}`);
      console.log('🔴 Step 11: Calling onCallEnd callback...');
      onCallEnd();
      console.log('🔴 ========== CALL END PROCESS COMPLETE ==========');
    } catch (error) {
      console.error('❌ Error leaving call:', error);
      toast.error('Error ending call');
      // Still try to clean up and call onCallEnd
      setShowEndCallConfirm(false);
      if (clientRef.current) {
        try {
          await clientRef.current.leave();
        } catch (e) {
          console.error('❌ Error in cleanup:', e);
        }
      }
      onCallEnd();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    console.log('🔇 Toggle mute called (expert side)', {
      hasAudioTrack: !!callState.localAudioTrack,
      currentMutedState: callState.isMuted,
      audioTrackEnabled: callState.localAudioTrack?.enabled
    });

    if (!callState.localAudioTrack) {
      console.error('❌ Audio track not available (expert side)');
      toast.error('Audio track not available');
      return;
    }
    
    try {
      const currentMutedState = callState.isMuted;
      const newMutedState = !currentMutedState;
      console.log('🔇 Toggling mute (expert side):', { from: currentMutedState, to: newMutedState });
      
      // Enable/disable the audio track
      const audioTrack = callState.localAudioTrack;
      audioTrack.setEnabled(!newMutedState);
      
      // Also ensure volume is set when unmuting
      if (!newMutedState) {
        // Unmuting: enable the track and ensure volume is set
        console.log('🔇 Unmuting audio track (expert side)');
        audioTrack.setVolume(100);
      } else {
        // Muting: disable the track
        console.log('🔇 Muting audio track (expert side)');
      }
      
      console.log('✅ Audio track enabled state (expert side):', audioTrack.enabled);
      
      // Update state
      setCallState(prev => ({
        ...prev,
        isMuted: newMutedState
      }));
      
      toast.success(newMutedState ? 'Microphone muted' : 'Microphone unmuted');
      console.log('✅ Mute state updated successfully (expert side)');
    } catch (error) {
      console.error('❌ Error toggling mute (expert side):', error);
      toast.error('Failed to toggle mute: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (!callState.localVideoTrack) return;
    
    const newVideoState = !callState.isVideoEnabled;
    callState.localVideoTrack.setEnabled(newVideoState);
    
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: newVideoState
    }));
  };

  // Rejoin call (expert side)
  const handleRejoinCall = useCallback(async () => {
    try {
      if (!callRequest.call_session_id) {
        toast.error('No call session found to rejoin');
        setShowInterruptionModal(false);
        return;
      }

      // Verify session is still active
      const { data: session } = await supabase
        .from('call_sessions')
        .select('status, start_time, selected_duration')
        .eq('id', callRequest.call_session_id)
        .single();

      if (!session || session.status !== 'active') {
        toast.error('Call session has ended');
        setShowInterruptionModal(false);
        return;
      }

      // Check 10-minute grace window
      if (session.start_time) {
        const callStartTime = new Date(session.start_time);
        const now = new Date();
        const timeDiff = now.getTime() - callStartTime.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        // Check if more than 10 minutes have passed since call start
        if (minutesDiff > 10) {
          toast.error('The grace window for rejoining has expired. The call session has ended.');
          setShowInterruptionModal(false);
          return;
        }
      }

      // Restore call start time if available
      if (session.start_time) {
        setCallStartTime(new Date(session.start_time));
        startDurationTimer(new Date(session.start_time));
      }

      // Set rejoining flag to prevent duplicate modals
      isRejoiningRef.current = true;
      modalShownRef.current = false; // Reset modal shown flag when rejoining
      console.log('🔄 Expert starting rejoin process - setting isRejoining flag and resetting modalShown');
      
      // Close modal immediately to prevent duplicate
      setShowInterruptionModal(false);
      setWasDisconnected(false);
      
      // Rejoin the call
      await handleJoinCall();
      
      // Flag will be reset when CONNECTED state is reached
      toast.success('Rejoining call...');
    } catch (error) {
      console.error('❌ Error rejoining call:', error);
      toast.error('Failed to rejoin call');
      setShowInterruptionModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callRequest.call_session_id, startDurationTimer]);

  // Handle interruption end call
  const handleInterruptionEndCall = useCallback(async () => {
    setShowInterruptionModal(false);
    await handleLeaveCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle user end call confirmation - cleanup after expert confirms
  const confirmUserEndCall = useCallback(async () => {
    console.log('✅ Expert confirmed user ended call, cleaning up...');
    
    // Leave Agora channel
    if (clientRef.current && callState.localAudioTrack) {
      try {
        await leaveCall(
          clientRef.current,
          callState.localAudioTrack,
          callState.localVideoTrack
        );
        console.log('✅ Left Agora channel after user ended call');
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
    if (callState.remoteUsers.length > 0) {
      callState.remoteUsers.forEach(user => {
        try {
          user.audioTrack?.stop();
          user.videoTrack?.stop();
        } catch (err) {
          console.warn('⚠️ Error stopping remote track:', err);
        }
      });
    }
    
    // Reset call state
    setCallState({
      localAudioTrack: null,
      localVideoTrack: null,
      remoteUsers: [],
      client: null,
      isJoined: false,
      isMuted: false,
      isVideoEnabled: false,
      isAudioEnabled: false
    });

    // Clear refs
    clientRef.current = null;
    currentSessionIdRef.current = null;
    setCallStartTime(null);
    setCallDuration(0);
    setShowUserEndCallConfirmation(false);
    
    // Call the callback
    onCallEnd();
  }, [callState, onCallEnd]);

  // REMOVED: Remote user activity monitoring for expert
  // Expert should only see popup when THEIR OWN connection has issues
  // Not when user's connection has issues (user will handle their own rejoin)

  // Listen for browser online/offline events
  // IMPORTANT: Show popup when network comes back ONLINE (not when it goes offline)
  useEffect(() => {
    if (!callState.isJoined) {
      return;
    }

    const handleOnline = () => {
      console.log('🌐 Browser came back online (expert side)');
      
      // IMPORTANT: Only show modal if expert's call was actually active
      // If we were disconnected when offline, show modal now that network is back
      // IMPORTANT: Only show if call was active for at least 1 second (prevents showing on first connection)
      const now = Date.now();
      const timeSinceLastTrigger = now - lastModalTriggerTimeRef.current;
      const callActiveDuration = callActiveStartTimeRef.current > 0 ? now - callActiveStartTimeRef.current : 0;
      
      if ((wasDisconnectedWhenOfflineRef.current || wasDisconnected) && callState.isJoined && 
          !isRejoiningRef.current && !modalShownRef.current && timeSinceLastTrigger > 2000 &&
          callActiveDuration > 1000) {
        console.log('✅ Network back online (expert call was active) - showing interruption modal so expert can rejoin', {
          callActiveDuration,
          timeSinceLastTrigger,
          allConditions: {
            wasDisconnectedWhenOffline: wasDisconnectedWhenOfflineRef.current,
            wasDisconnected,
            isJoined: callState.isJoined,
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
        setWasDisconnected(true);
        setShowInterruptionModal(true);
        wasDisconnectedWhenOfflineRef.current = false; // Reset flag
      } else {
        console.log('⚠️ Network back online but expert call not active - not showing modal', {
          wasDisconnectedWhenOffline: wasDisconnectedWhenOfflineRef.current,
          wasDisconnected,
          isJoined: callState.isJoined
        });
      }
    };

    const handleOffline = () => {
      console.log('🌐 Browser went offline (expert side) - marking as disconnected');
      // Just mark that we were disconnected, don't show modal yet
      // Modal will show when network comes back online
      wasDisconnectedWhenOfflineRef.current = true;
      setWasDisconnected(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [callState.isJoined, wasDisconnected]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (reconnectingTimeoutRef.current) {
        clearTimeout(reconnectingTimeoutRef.current);
        reconnectingTimeoutRef.current = null;
      }
      if (userActivityCheckRef.current) {
        clearInterval(userActivityCheckRef.current);
        userActivityCheckRef.current = null;
      }
    };
  }, []);

  // Auto-join on mount if not already joined
  useEffect(() => {
    // Prevent duplicate joins - check if client already exists and is connecting/connected
    if (clientRef.current) {
      const connectionState = clientRef.current.connectionState;
      if (connectionState === 'CONNECTING' || connectionState === 'CONNECTED') {
        console.log('⚠️ Expert: Auto-join skipped - client already connecting/connected');
        return;
      }
    }

    if (!callState.isJoined && !isConnecting && callRequest.channel_name) {
      console.log('🚀 Auto-joining call on mount...', {
        channel_name: callRequest.channel_name,
        has_token: !!callRequest.agora_token,
        has_uid: !!callRequest.agora_uid
      });
      handleJoinCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callRequest.channel_name]);

  // Subscribe to call session status changes (to detect when user ends call)
  // Note: Subscription is set up in handleJoinCall when session ID is available
  // This effect only handles cleanup when call state changes
  useEffect(() => {
    // Cleanup subscription when call is no longer joined
    if (!callState.isJoined && sessionChannelRef.current) {
      console.log('🧹 Cleaning up call session subscription (expert side) - call no longer joined');
      const channel = sessionChannelRef.current;
      supabase.removeChannel(channel);
      sessionChannelRef.current = null;
    }
  }, [callState.isJoined]);

  // Play videos when refs are ready or layout changes
  useEffect(() => {
    if (callRequest.call_type === 'video' && callState.isJoined) {
      // Play local video
      if (callState.localVideoTrack && localVideoRef.current && callState.isVideoEnabled) {
        const playLocalVideo = async () => {
          try {
            if (!callState.localVideoTrack!.enabled) {
              callState.localVideoTrack!.setEnabled(true);
            }
            await callState.localVideoTrack!.play(localVideoRef.current!, { mirror: true });
            console.log('✅ Playing local video track (expert side - useEffect)');
          } catch (error) {
            console.warn('⚠️ Could not play local video:', error);
          }
        };
        
        // Use requestAnimationFrame for better timing
        const rafId = requestAnimationFrame(() => {
          setTimeout(playLocalVideo, 100);
        });
        
        return () => cancelAnimationFrame(rafId);
      }
    }
  }, [callRequest.call_type, callState.isJoined, callState.localVideoTrack, callState.isVideoEnabled, showChat]);

  // Play remote video when available
  useEffect(() => {
    if (callRequest.call_type === 'video' && callState.remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = callState.remoteUsers[0];
      if (remoteUser.videoTrack) {
        const playRemoteVideo = async () => {
          try {
            await remoteUser.videoTrack!.play(remoteVideoRef.current!);
            console.log('✅ Playing remote video track (expert side - useEffect)');
          } catch (error) {
            console.warn('⚠️ Could not play remote video:', error);
          }
        };
        
        setTimeout(playRemoteVideo, 100);
      }
    }
  }, [callRequest.call_type, callState.remoteUsers, showChat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
      const channel = sessionChannelRef.current;
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      if (clientRef.current && callState.localAudioTrack) {
        leaveCall(clientRef.current, callState.localAudioTrack, callState.localVideoTrack).catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userName = callRequest.user_metadata?.name || 'User';
  const userAvatar = callRequest.user_metadata?.avatar || null;

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      {/* Connection Status */}
      {isConnecting && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">🔄 Connecting to call...</p>
        </div>
      )}
      
      {!callState.isJoined && !isConnecting && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">⚠️ Not connected. Please wait...</p>
        </div>
      )}
      
      {/* Call Header */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Call with {userName}</span>
            <Badge variant={callState.isJoined ? "default" : "secondary"}>
              {callState.isJoined ? formatDuration(callDuration) : '0:00'}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Video Display */}
      {callRequest.call_type === 'video' && (
        <div className={`flex ${showChat ? 'flex-row gap-4 px-6' : 'flex-col px-0'} h-full flex-1 min-h-0`}>
          <div className={`${showChat ? 'flex-[0.7]' : 'w-full flex-1'} min-h-0`}>
            <div className={`grid grid-cols-2 gap-4 h-full ${showChat ? 'min-h-0' : ''}`}>
              {/* Remote Video */}
              <Card className="relative overflow-hidden bg-black min-h-0">
                <CardContent className="p-0 h-full min-h-0">
                  <div ref={remoteVideoRef} className="w-full h-full min-h-[200px]" />
                  {!callState.remoteUsers.length && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userAvatar || undefined} />
                        <AvatarFallback>{userName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {userName}
                  </div>
                </CardContent>
              </Card>

              {/* Local Video */}
              <Card className="relative overflow-hidden bg-black min-h-0">
                <CardContent className="p-0 h-full min-h-0">
                  <div ref={localVideoRef} className="w-full h-full min-h-[200px]" />
                  {!callState.localVideoTrack && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  {callState.localVideoTrack && !callState.isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <VideoOff className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    You {callState.isVideoEnabled ? '(Video On)' : '(Video Off)'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Panel - Always render to preserve messages (30% width) */}
          {callState.client && (
            <div className={`flex-[0.3] min-w-0 min-h-0 ${showChat ? '' : 'hidden'}`}>
              <Card className="border border-border/50 shadow-xl bg-gradient-to-br from-card via-background to-muted/20 h-full overflow-hidden flex flex-col">
                <CardContent className="p-0 h-full min-h-0 flex flex-col">
                  <CallChat
                    visible={showChat}
                    client={callState.client}
                    userName={expertName}
                    expertName={userName}
                    expertAvatar={userAvatar || undefined}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Audio Call Display */}
      {callRequest.call_type === 'audio' && (
        <div className={`flex ${showChat ? 'flex-row gap-4 px-6' : 'flex-col px-0'} flex-1 min-h-0`}>
          <div className={`${showChat ? 'flex-[0.7]' : 'w-full flex-1'} min-h-0`}>
            <Card className="flex-1 flex items-center justify-center h-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userAvatar || undefined} />
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{userName}</h3>
                    <p className="text-sm text-muted-foreground">Audio Call</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel - Always render to preserve messages (30% width) */}
          {callState.client && (
            <div className={`flex-[0.3] min-w-0 min-h-0 ${showChat ? '' : 'hidden'}`}>
              <Card className="border border-border/50 shadow-xl bg-gradient-to-br from-card via-background to-muted/20 h-full overflow-hidden flex flex-col">
                <CardContent className="p-0 h-full min-h-0 flex flex-col">
                  <CallChat
                    visible={showChat}
                    client={callState.client}
                    userName={expertName}
                    expertName={userName}
                    expertAvatar={userAvatar || undefined}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center space-x-4 flex-shrink-0 pb-4">
              <Button
          variant={callState.isMuted ? 'destructive' : 'outline'}
                size="lg"
          onClick={() => {
            console.log('🔇 Mute button clicked (expert side)', {
              hasAudioTrack: !!callState.localAudioTrack,
              isMuted: callState.isMuted,
              isJoined: callState.isJoined
            });
            if (callState.localAudioTrack) {
              toggleMute();
            } else {
              console.error('❌ Cannot toggle mute: audio track not available');
            }
          }}
          disabled={!callState.localAudioTrack || !callState.isJoined}
          title={callState.isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {callRequest.call_type === 'video' && (
                <Button
            variant={callState.isVideoEnabled ? 'outline' : 'destructive'}
                  size="lg"
            onClick={toggleVideo}
            disabled={!callState.localVideoTrack}
          >
            {callState.isVideoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
                </Button>
              )}

              <Button
                variant={showChat ? 'default' : 'outline'}
                size="lg"
                onClick={() => setShowChat(!showChat)}
                title={showChat ? 'Hide chat' : 'Show chat'}
                disabled={!callState.client || callState.client?.connectionState !== 'CONNECTED'}
              >
                {showChat ? (
                  <MessageSquareOff className="w-5 h-5" />
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={() => {
                  console.log('🔘 End Call button clicked - opening confirmation');
                  setShowEndCallConfirm(true);
                }}
                disabled={!callState.isJoined}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
        </div>

      {/* Call Interruption Modal */}
      <CallInterruptionModal
        isOpen={showInterruptionModal}
        onRejoin={handleRejoinCall}
        onEndCall={handleInterruptionEndCall}
        isUser={false}
      />
      
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 text-xs rounded z-50">
          <div>Modal: {showInterruptionModal ? 'OPEN' : 'CLOSED'}</div>
          <div>Remote Users: {callState.remoteUsers.length}</div>
          <div>Joined: {callState.isJoined ? 'YES' : 'NO'}</div>
          <div>User Disconnected: {userDisconnectedRef.current ? 'YES' : 'NO'}</div>
        </div>
      )}

      {/* Expert End Call Confirmation - First Dialog */}
      <AlertDialog open={showEndCallConfirm} onOpenChange={setShowEndCallConfirm}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>End Call?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-2">
              <p>
                If the call is complete, ask the user to end the call to mark it as complete.
              </p>
              <p>
                If there is any issue, you may disconnect the call with a reason.
              </p>
              <div className="space-y-2 pt-2">
                <Label htmlFor="disconnection-reason">Reason for disconnection (if applicable):</Label>
                <Select
                  value={disconnectionReason}
                  onValueChange={setDisconnectionReason}
                >
                  <SelectTrigger id="disconnection-reason" className="w-full">
                    <SelectValue placeholder="Select a reason (optional)" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]" position="popper" sideOffset={5}>
                    <SelectItem value="user_misbehaving">User is misbehaving</SelectItem>
                    <SelectItem value="expert_emergency">I have an emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log('❌ Cancel clicked - keeping call active');
              setShowEndCallConfirm(false);
              setDisconnectionReason('');
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 End Call first confirmation - showing reason confirmation');
                setShowEndCallConfirm(false);
                setShowEndCallReasonConfirm(true);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Expert End Call Confirmation - Second Dialog (Double Confirmation) */}
      <AlertDialog open={showEndCallReasonConfirm} onOpenChange={setShowEndCallReasonConfirm}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm End Call</AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              {disconnectionReason ? (
                <>
                  <p className="mb-2">
                    You are ending the call with reason: <strong>
                      {disconnectionReason === 'user_misbehaving' ? 'User is misbehaving' : 'I have an emergency'}
                    </strong>
                  </p>
                  <p>Duration: <strong>{formatDuration(callDuration)}</strong></p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Are you sure you want to proceed?
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-2">
                    Are you sure you want to end this call?
                  </p>
                  <p>Duration: <strong>{formatDuration(callDuration)}</strong></p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Note: If the call is complete, it's better to ask the user to end it.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log('❌ Second confirmation cancelled - going back to first dialog');
              setShowEndCallReasonConfirm(false);
              setShowEndCallConfirm(true);
            }}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 End Call confirmed in second dialog - calling handleLeaveCall');
                setShowEndCallReasonConfirm(false);
                await handleLeaveCall();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, End Call
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User End Call Confirmation Dialog */}
      <AlertDialog open={showUserEndCallConfirmation} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-orange-600">Call Ended by User</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              The user has ended the call. Duration: <strong>{formatDuration(callDuration)}</strong>
              <br />
              <br />
              Click "OK" to disconnect from the call channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={async () => {
                await confirmUserEndCall();
              }}
              className="w-full sm:w-auto"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgoraCallInterface;

