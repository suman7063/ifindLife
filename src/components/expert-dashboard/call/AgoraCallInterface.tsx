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
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff,
  Video,
  VideoOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  createClient, 
  joinCall, 
  leaveCall, 
  type CallState,
  type CallType 
} from '@/utils/agoraService';
import { AGORA_CONFIG } from '@/utils/agoraConfig';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { endCall } from '@/services/callService';

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
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);

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

      // Set up event listeners
      client.on('user-published', async (user, mediaType) => {
        console.log('👤 User published:', user.uid, mediaType);
        
        await client.subscribe(user, mediaType);
        
        setCallState(prev => ({
          ...prev,
          remoteUsers: [...prev.remoteUsers.filter(u => u.uid !== user.uid), user]
        }));

        // Play remote video if video call
        if (mediaType === 'video' && remoteVideoRef.current && user.videoTrack) {
          try {
            await user.videoTrack.play(remoteVideoRef.current);
            console.log('✅ Playing remote video track (expert side)');
          } catch (error) {
            console.warn('⚠️ Could not play remote video:', error);
          }
        }
        
        // Handle remote audio - explicitly configure audio track
        // Note: In video calls, audio and video are published separately, so we handle both
        if (mediaType === 'audio' && user.audioTrack) {
          console.log('✅ Remote audio track subscribed (expert side)');
          try {
            // Set volume for remote audio track (0-100)
            user.audioTrack.setVolume(100);
            console.log('✅ Remote audio track volume set to 100 (expert side)');
            
            // Note: Agora SDK typically auto-plays remote audio, but we ensure it's configured
            // Remote audio tracks don't have a .play() method like video tracks
            // They are automatically played when subscribed
          } catch (audioError) {
            console.warn('⚠️ Could not configure remote audio:', audioError);
          }
        }
      });

      client.on('user-unpublished', (user) => {
        console.log('👤 User unpublished:', user.uid);
        setCallState(prev => ({
              ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
        }));
      });

      client.on('user-left', (user) => {
        console.log('👤 User left:', user.uid);
        setCallState(prev => ({
            ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
        }));
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
    try {
      console.log('🔴 Expert ending call');
      
      // Calculate duration
      let finalDuration = 0;
      if (callStartTime) {
        finalDuration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
      }

      // Update database
      if (currentSessionIdRef.current) {
        try {
          await endCall(currentSessionIdRef.current, finalDuration, 'expert');
          console.log('✅ Call session updated in database');
        } catch (dbError) {
          console.error('❌ Error updating call session:', dbError);
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

      // Leave Agora channel
        if (clientRef.current && callState.localAudioTrack) {
        try {
          await leaveCall(
            clientRef.current,
            callState.localAudioTrack,
            callState.localVideoTrack
          );
          console.log('✅ Successfully left Agora channel');
      } catch (agoraError) {
        console.error('❌ Error leaving Agora call:', agoraError);
        }
      }

      // Stop timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      toast.success(`Call ended. Duration: ${formatDuration(finalDuration)}`);
      onCallEnd();
    } catch (error) {
      console.error('❌ Error leaving call:', error);
      toast.error('Error ending call');
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

  // Auto-join on mount if not already joined
  useEffect(() => {
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
      if (clientRef.current && callState.localAudioTrack) {
        leaveCall(clientRef.current, callState.localAudioTrack, callState.localVideoTrack).catch(console.error);
      }
    };
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
        <div className="grid grid-cols-2 gap-4 h-full flex-1 min-h-0">
          {/* Remote Video */}
          <Card className="relative overflow-hidden bg-black">
            <CardContent className="p-0 h-full">
              <div ref={remoteVideoRef} className="w-full h-full" />
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
          <Card className="relative overflow-hidden bg-black">
            <CardContent className="p-0 h-full">
              <div ref={localVideoRef} className="w-full h-full" />
              {!callState.localVideoTrack && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                You {callState.isVideoEnabled ? '(Video On)' : '(Video Off)'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audio Call Display */}
      {callRequest.call_type === 'audio' && (
        <Card className="flex-1 flex items-center justify-center">
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
                variant="destructive"
                size="lg"
          onClick={() => setShowEndCallConfirm(true)}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
        </div>

      {/* End Call Confirmation */}
    <AlertDialog open={showEndCallConfirm} onOpenChange={setShowEndCallConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Call?</AlertDialogTitle>
          <AlertDialogDescription>
              Are you sure you want to end this call? Duration: {formatDuration(callDuration)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveCall}>End Call</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
};

export default AgoraCallInterface;

