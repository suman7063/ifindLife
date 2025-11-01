
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRealAgoraCall } from '@/hooks/useRealAgoraCall';
import { useCallSession, type CallSession } from '@/hooks/useCallSession';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { createClient, joinCall, leaveCall } from '@/utils/agoraService';
import type { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallTypeSelector from '../AgoraCallTypeSelector';
import SimpleCallTypeSelector from '@/components/chat/SimpleCallTypeSelector';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';


interface Expert {
  id: string | number; // Can be UUID string or number (for backwards compatibility)
  name: string;
  imageUrl: string;
  price: number;
}

interface EnhancedAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
}

const EnhancedAgoraCallModal: React.FC<EnhancedAgoraCallModalProps> = ({
  isOpen,
  onClose,
  expert
}) => {
  const { isAuthenticated, userProfile } = useSimpleAuth();
  const { currentSession, getCallSession } = useCallSession();
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callStatus, setCallStatus] = useState<'choosing' | 'waiting' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  
  // Extended CallSession type with Agora fields
  type CallSessionWithAgora = CallSession & {
    agora_token?: string | null;
    agora_uid?: number | null;
    agora_channel_name?: string | null;
  };
  const [showChat, setShowChat] = useState(false);
  const [isWaitingForExpert, setIsWaitingForExpert] = useState(false);
  
  // Agora state
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const [callState, setCallState] = useState<any>({
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    client: null,
    isJoined: false,
    isMuted: false,
    isVideoEnabled: true,
    isAudioEnabled: true
  });
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [callError, setCallError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const subscriptionRef = useRef<any>(null);

  // Check for existing session when modal opens
  useEffect(() => {
    if (!isOpen || !isAuthenticated || !userProfile) return;

    const checkExistingSession = async () => {
      // Check if we have a current session
      if (currentSession) {
        console.log('📞 Found existing session, checking for call request...');
        await waitForExpertAcceptance(currentSession.id);
      } else {
        // Try to find session for this expert
        // expert.id can be UUID string or number - convert to string for query
        // Note: expert_id in DB is UUID, but TypeScript interface says number (type mismatch)
        const expertIdStr = typeof expert.id === 'string' ? expert.id : expert.id.toString();
        // Use type assertion because DB column is UUID but TS types say number
        const query = supabase
          .from('call_sessions')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1) as any;
        
        const { data: sessions, error: sessionQueryError } = await query.eq('expert_id', expertIdStr);

        if (sessionQueryError) {
          console.error('❌ Error querying call sessions:', sessionQueryError);
        }

        if (sessions && sessions.length > 0) {
          const session = sessions[0] as any;
          console.log('📞 Found pending session:', session.id);
          await waitForExpertAcceptance(session.id);
        }
      }
    };

    checkExistingSession();
  }, [isOpen, isAuthenticated, userProfile, expert.id, currentSession]);

  // Wait for expert to accept the call
  const waitForExpertAcceptance = async (sessionId: string) => {
    try {
      setCallStatus('waiting');
      setIsWaitingForExpert(true);
      toast.info('Waiting for expert to accept your call...');

      // Find the call request for this session
      const { data: requests } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('call_session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!requests || requests.length === 0) {
        console.error('No call request found for session');
        return;
      }

      const request = requests[0];
      
      // Check if already accepted
      if (request.status === 'accepted') {
        console.log('✅ Call already accepted, joining...');
        await joinAgoraCall(sessionId);
        return;
      }

      if (request.status === 'declined') {
        toast.error('Call was declined by the expert');
        setCallStatus('error');
        return;
      }

      // Subscribe to status changes
      const channel = supabase
        .channel(`call_request_${request.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'incoming_call_requests',
            filter: `id=eq.${request.id}`
          },
          async (payload) => {
            const updated = payload.new as any;
            console.log('📞 Call request status updated:', updated.status);
            
            if (updated.status === 'accepted') {
              console.log('✅ Expert accepted the call! Connecting now...');
              toast.success('Expert accepted your call! Connecting...', {
                duration: 5000
              });
              setCallStatus('connecting');
              setIsWaitingForExpert(false);
              await joinAgoraCall(sessionId);
            } else if (updated.status === 'declined') {
              toast.error('Call was declined by the expert');
              setCallStatus('error');
              subscriptionRef.current?.unsubscribe();
            }
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
    } catch (error) {
      console.error('❌ Error waiting for expert acceptance:', error);
      setCallError('Failed to wait for expert acceptance');
      setCallStatus('error');
    }
  };

  // Join Agora call when expert accepts
  const joinAgoraCall = async (sessionId: string) => {
    try {
      setIsWaitingForExpert(false);
      setCallStatus('connecting');
      setIsConnecting(true);

      // Get session with token (fetch directly to get all fields)
      const { data: sessionData, error: sessionError } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        throw new Error('Session not found');
      }

      const session = sessionData as CallSessionWithAgora;

      if (!session.channel_name) {
        throw new Error('Missing channel name in session');
      }

      // Get or generate token - if token is null, generate a fresh one
      let token = session.agora_token;
      let uid = session.agora_uid || Math.floor(Math.random() * 1000000);

      if (!token || token === 'null') {
        console.log('🔄 Token missing in session, attempting to generate new token...');
        try {
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-agora-token', {
            body: {
              channelName: session.channel_name,
              uid: uid,
              role: 1, // Publisher role
              expireTime: 3600 // 1 hour expiry
            }
          });

          if (tokenError) {
            console.warn('⚠️ Failed to generate token via edge function:', tokenError.message);
            console.warn('⚠️ Will attempt to join with null token (tokenless mode)');
            console.warn('⚠️ Make sure your Agora project allows tokenless mode or deploy the edge function');
            // Don't throw - allow fallback to null token
            token = null;
          } else {
            token = tokenData?.token || null;
            console.log('✅ Generated new token:', token ? 'Token received' : 'Token is null');
            
            if (!token) {
              console.warn('⚠️ Token generation returned null - make sure AGORA_APP_CERTIFICATE is set or tokenless mode is enabled');
            }
          }
        } catch (tokenErr) {
          console.warn('⚠️ Error calling token generation function:', tokenErr);
          console.warn('⚠️ This might mean the edge function is not deployed or there is a network issue');
          console.warn('⚠️ Will attempt to join with null token (tokenless mode)');
          console.warn('⚠️ Make sure:');
          console.warn('   1. The generate-agora-token edge function is deployed');
          console.warn('   2. Your Agora project allows tokenless mode in the console');
          // Don't throw - allow fallback to null token for tokenless mode
          token = null;
        }
      }

      console.log('🎥 Joining Agora call...', {
        channel: session.channel_name,
        hasToken: !!token
      });

      // Create client
      const client = createClient();
      clientRef.current = client;

      // Join call - map 'voice' to 'audio' for CallType
      const tracks = await joinCall(
        {
          channelName: session.channel_name,
          token: token,
          uid: uid,
          callType: session.call_type === 'video' ? 'video' : 'audio'
        },
        client
      );

      localAudioTrackRef.current = tracks.localAudioTrack;
      localVideoTrackRef.current = tracks.localVideoTrack;

      // Update state
      setCallState({
        localAudioTrack: tracks.localAudioTrack,
        localVideoTrack: tracks.localVideoTrack,
        remoteUsers: [],
        client,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: session.call_type === 'video',
        isAudioEnabled: true
      });

      setCallType(session.call_type === 'video' ? 'video' : 'voice');
      setCallStatus('connected');
      setIsConnecting(false);

      // Setup remote user handlers
      client.on('user-published', async (user, mediaType) => {
        console.log('👤 Remote user published:', user.uid, mediaType);
        await client.subscribe(user, mediaType);
        
        // Handle audio tracks - ensure they play
        if (mediaType === 'audio') {
          user.audioTrack?.play();
          console.log('✅ Playing remote audio track');
        }
        
        // Update remote users list (for both audio and video)
        setCallState((prev: any) => {
          const existingUser = prev.remoteUsers.find((u: any) => u.uid === user.uid);
          if (existingUser) {
            // Update existing user with new track
            return {
              ...prev,
              remoteUsers: prev.remoteUsers.map((u: any) => 
                u.uid === user.uid ? user : u
              )
            };
          } else {
            // Add new user
            return {
              ...prev,
              remoteUsers: [...prev.remoteUsers, user]
            };
          }
        });
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log('👤 Remote user unpublished:', user.uid, mediaType);
        
        // Stop tracks when unpublished
        if (mediaType === 'audio') {
          user.audioTrack?.stop();
        }
        if (mediaType === 'video') {
          user.videoTrack?.stop();
        }
        
        // Update state - only remove user if they've unpublished both tracks
        setCallState((prev: any) => {
          const existingUser = prev.remoteUsers.find((u: any) => u.uid === user.uid);
          if (existingUser) {
            // Check if user has any remaining tracks
            const hasAudio = mediaType !== 'audio' && existingUser.audioTrack;
            const hasVideo = mediaType !== 'video' && existingUser.videoTrack;
            
            if (!hasAudio && !hasVideo) {
              // Remove user if no tracks remain
              return {
                ...prev,
                remoteUsers: prev.remoteUsers.filter((u: any) => u.uid !== user.uid)
              };
            } else {
              // Keep user but update their tracks
              return {
                ...prev,
                remoteUsers: prev.remoteUsers.map((u: any) => 
                  u.uid === user.uid ? user : u
                )
              };
            }
          }
          return prev;
        });
      });

      client.on('user-left', (user) => {
        console.log('👤 Remote user left:', user.uid);
        
        // Stop all tracks when user leaves
        user.audioTrack?.stop();
        user.videoTrack?.stop();
        
        setCallState((prev: any) => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter((u: any) => u.uid !== user.uid)
        }));
      });

      toast.success('Connected to expert!', {
        duration: 3000
      });
      console.log('✅ Successfully connected to Agora call');
    } catch (error: any) {
      console.error('❌ Error joining Agora call:', error);
      setCallError(error.message || 'Failed to join call');
      setCallStatus('error');
      setIsConnecting(false);
      toast.error('Failed to connect to call');
    }
  };

  // CRITICAL: Protect authentication during video call
  useEffect(() => {
    if (isOpen) {
      console.log('🔒 Video call modal opened, protecting auth state');
      sessionStorage.setItem('videoCallActive', 'true');
    } else {
      console.log('🔒 Video call modal closed, releasing auth protection');
      sessionStorage.removeItem('videoCallActive');
    }

    return () => {
      sessionStorage.removeItem('videoCallActive');
      // Cleanup subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isOpen]);

  // Enhanced auth state monitoring
  useEffect(() => {
    console.log('🔒 EnhancedAgoraCallModal - Auth state:', {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      modalOpen: isOpen,
      callStatus
    });
  }, [isAuthenticated, userProfile, isOpen, callStatus]);

  const handleStartCall = async (selectedDuration: number, selectedCallType: 'video' | 'voice') => {
    // This will be handled by the session creation in useExpertConnection
    // The modal should just wait for the session to be ready
    console.log('📞 Call type selected, session should already be created');
  };

  const handleEndCall = async () => {
    try {
      console.log('🔒 Ending call, maintaining auth state');
      
      // Leave Agora call
      if (clientRef.current) {
        await leaveCall(
          clientRef.current,
          localAudioTrackRef.current,
          localVideoTrackRef.current
        );
      }

      // Cleanup
      localAudioTrackRef.current = null;
      localVideoTrackRef.current = null;
      clientRef.current = null;
      setCallState({
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: [],
        client: null,
        isJoined: false,
        isMuted: false,
        isVideoEnabled: true,
        isAudioEnabled: true
      });

      setCallStatus('ended');
      
      // Cleanup subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      
      // Small delay before closing to show results
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('🔒 Error ending call:', error);
      setCallStatus('error');
    }
  };

  const handleToggleMute = () => {
    if (localAudioTrackRef.current) {
      const muted = !callState.isMuted;
      localAudioTrackRef.current.setEnabled(!muted);
      setCallState((prev: any) => ({ ...prev, isMuted: muted, isAudioEnabled: !muted }));
    }
  };

  const handleToggleVideo = () => {
    if (localVideoTrackRef.current) {
      const enabled = !callState.isVideoEnabled;
      localVideoTrackRef.current.setEnabled(enabled);
      setCallState((prev: any) => ({ ...prev, isVideoEnabled: enabled }));
    }
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  // Show auth message if not authenticated
  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <CallAuthMessage expertName={expert.name} onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  // Show error message if there's a call error
  if (callStatus === 'error' && callError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <CallErrorMessage 
            errorMessage={callError} 
            onRetry={() => setCallStatus('choosing')} 
            onClose={onClose} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${showChat && callStatus === 'connected' ? 'sm:max-w-6xl' : 'sm:max-w-4xl'} max-h-[90vh] overflow-auto`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {callStatus === 'choosing' && `Connect with ${expert.name}`}
              {callStatus === 'connecting' && `Connecting to ${expert.name}...`}
              {callStatus === 'connected' && `In call with ${expert.name}`}
              {callStatus === 'ended' && `Call Ended`}
            </DialogTitle>
            <DialogDescription>
              {callStatus === 'choosing' && 'Choose your call type and duration'}
              {callStatus === 'waiting' && 'Waiting for expert to accept your call request...'}
              {callStatus === 'connecting' && 'Expert accepted! Connecting now...'}
              {callStatus === 'connected' && 'You are connected with the expert'}
              {callStatus === 'ended' && 'The call has ended'}
            </DialogDescription>
          </DialogHeader>

          {callStatus === 'choosing' && (
            <SimpleCallTypeSelector
              expert={{
                id: expert.id,
                name: expert.name,
                imageUrl: expert.imageUrl,
                price: expert.price
              } as any}
              onStartCall={handleStartCall}
            />
          )}

          {callStatus === 'waiting' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg font-medium">Waiting for expert to accept...</p>
              <p className="text-sm text-gray-500">The expert has been notified and will respond shortly.</p>
            </div>
          )}

          {(callStatus === 'connecting' || callStatus === 'connected' || isConnecting) && (
            <div className="space-y-4">
              <AgoraCallContent
                callState={callState}
                callStatus={isConnecting ? 'connecting' : (callState?.isJoined ? 'connected' : (callStatus === 'waiting' ? 'connecting' : callStatus))}
                showChat={showChat}
                duration={duration}
                remainingTime={remainingTime}
                cost={cost}
                formatTime={formatTime}
                expertPrice={expert.price}
                userName={userProfile?.name || 'User'}
                expertName={expert.name}
              />
              
              {(callState?.isJoined || callStatus === 'connected') && (
                <AgoraCallControls
                  callState={callState}
                  callType={callType === 'video' ? 'video' : 'audio'}
                  onToggleMute={handleToggleMute}
                  onToggleVideo={handleToggleVideo}
                  onEndCall={handleEndCall}
                  onToggleChat={() => setShowChat(!showChat)}
                  showChat={showChat}
                />
              )}
            </div>
          )}

          {callStatus === 'ended' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Call Completed</h3>
              <p className="text-gray-600 mb-2">Duration: {formatTime(duration)}</p>
              <p className="text-gray-600">Total Cost: ${cost.toFixed(2)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default EnhancedAgoraCallModal;
