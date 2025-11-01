import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  Users,
  User,
  Clock,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  createClient, 
  joinCall, 
  leaveCall, 
  toggleMute, 
  toggleVideo,
  type CallState,
  type CallType 
} from '@/utils/agoraService';
import { AGORA_CONFIG } from '@/utils/agoraConfig';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';

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
    estimated_cost_eur?: number | null;
    estimated_cost_inr?: number | null;
    estimated_cost_usd?: number | null; // Keep for backward compatibility
    user_metadata: UserMetadata;
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

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Join the Agora call
  const handleJoinCall = async () => {
    try {
      setIsConnecting(true);
      // CRITICAL: Use console.error to ensure it's visible
      console.error('🚨🔗 JOIN CALL STARTED - This should ALWAYS be visible');
      console.log('🔗 Joining Agora call...', callRequest);

      // Get or generate token - if token is null, generate a fresh one
      let token = callRequest.agora_token;
      const uid = callRequest.agora_uid || Math.floor(Math.random() * 1000000);

      // DEBUG: Log token value BEFORE checking - use console.error to ensure visibility
      console.error('🚨🔍 TOKEN CHECK - This should ALWAYS be visible:', {
        tokenValue: token,
        tokenType: typeof token,
        isNull: token === null,
        isUndefined: token === undefined,
        isEmptyString: token === '',
        isNullString: token === 'null',
        isUndefinedString: token === 'undefined',
        willGenerate: !token || token === 'null' || token === '' || token === 'undefined',
        fullCallRequest: callRequest
      });

      // Check for invalid/empty token values - treat as missing
      if (!token || token === 'null' || token === '' || token === 'undefined') {
        console.log('🔄 Token missing, attempting to generate new token...');
        console.log('📋 Call details:', { 
          channelName: callRequest.channel_name, 
          uid, 
          appId: AGORA_CONFIG.APP_ID || 'NOT SET (check VITE_AGORA_APP_ID in .env)' 
        });
        
        // Verify Supabase connection first
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          console.log('🔍 Checking Supabase connection:', { 
            hasUrl: !!supabaseUrl,
            url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing'
          });
        } catch (checkErr) {
          console.warn('⚠️ Could not verify Supabase URL:', checkErr);
        }

        try {
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-agora-token', {
            body: {
              channelName: callRequest.channel_name,
              uid: uid,
              role: 1, // Publisher role
              expireTime: 3600 // 1 hour expiry
            }
          });

          console.log('📥 Token generation response:', { 
            hasData: !!tokenData, 
            hasError: !!tokenError,
            errorMessage: tokenError?.message,
            tokenType: tokenData?.tokenType,
            warning: tokenData?.warning
          });

          if (tokenError) {
            console.error('❌ Failed to generate token via edge function:', tokenError);
            console.error('❌ Error details:', {
              message: tokenError.message,
              name: tokenError.name,
              stack: tokenError.stack
            });
            
            // Check for specific error types
            if (tokenError.message?.includes('Failed to send a request') || 
                tokenError.name === 'FunctionsFetchError') {
              console.error('');
              console.error('🔴 ========================================');
              console.error('🔴 EDGE FUNCTION NOT DEPLOYED OR UNREACHABLE');
              console.error('🔴 ========================================');
              console.error('');
              console.error('This error means the Supabase Edge Function cannot be reached.');
              console.error('');
              console.error('📋 IMMEDIATE STEPS TO FIX:');
              console.error('');
              console.error('1️⃣  Verify Supabase project is linked:');
              console.error('   Run: supabase link --project-ref nmcqyudqvbldxwzhyzma');
              console.error('');
              console.error('2️⃣  Deploy the edge function:');
              console.error('   Run: supabase functions deploy generate-agora-token');
              console.error('');
              console.error('3️⃣  Verify deployment success:');
              console.error('   You should see: "✅ Function deployed successfully"');
              console.error('');
              console.error('4️⃣  Check Supabase Dashboard:');
              console.error('   Go to: Edge Functions → generate-agora-token');
              console.error('   Verify the function appears in the list');
              console.error('');
              console.error('5️⃣  Verify environment variables:');
              console.error('   Supabase Dashboard → Project Settings → Edge Functions → Secrets');
              console.error('   Required secrets:');
              console.error('   - AGORA_APP_ID = (get from your .env VITE_AGORA_APP_ID)');
              console.error('   - AGORA_APP_CERTIFICATE = (your certificate from Agora Console)');
              console.error('');
              console.error('6️⃣  Test the function manually:');
              console.error('   Go to Supabase Dashboard → Edge Functions → generate-agora-token → Test');
              console.error('');
            } else {
              console.error('🔴 CRITICAL: Cannot join call without token. The edge function must be deployed!');
              console.error('🔴 Action required:');
              console.error('   1. Deploy edge function: supabase functions deploy generate-agora-token');
              console.error('   2. Verify AGORA_APP_CERTIFICATE is set in Supabase Secrets');
              console.error('   3. Verify AGORA_APP_ID is set in Supabase Secrets (should match VITE_AGORA_APP_ID from .env)');
            }
            
            // Show user-friendly error
            toast.error('Failed to connect to token service. Please deploy the edge function.');
            throw new Error('Edge function not available: ' + tokenError.message);
          } else {
            token = tokenData?.token || null;
            console.log('✅ Generated new token:', token ? 'Token received (length: ' + token.length + ')' : 'Token is null');
            
            if (!token) {
              // Token is null - try temporary token from env, then tokenless mode
              const tempToken = import.meta.env.VITE_AGORA_TEMP_TOKEN;
              
              if (tempToken && tempToken !== '') {
                console.log('⚠️ Using temporary token from environment (for testing)');
                console.log('⚠️ Temporary tokens expire - generate new one in Agora Console when needed');
                token = tempToken;
              } else {
                // Token is null - using tokenless mode
                console.log('ℹ️ Token is null - using tokenless mode');
                console.log('ℹ️ Free Agora accounts often use "APP ID only" mode (tokenless by default)');
                console.log('ℹ️ Attempting to join call with null token...');
                console.log('ℹ️ If you get "invalid vendor key" error, your project requires certificates');
                console.log('ℹ️ SOLUTION: Add VITE_AGORA_TEMP_TOKEN to .env with token from Agora Console');
                // Don't throw error - allow tokenless mode to proceed
                // The Agora SDK will handle null tokens if tokenless mode is enabled in the project
              }
            }
          }
        } catch (tokenErr: unknown) {
          const error = tokenErr instanceof Error ? tokenErr : new Error(String(tokenErr));
          console.error('');
          console.error('❌ ========================================');
          console.error('❌ ERROR CALLING TOKEN GENERATION FUNCTION');
          console.error('❌ ========================================');
          console.error('');
          console.error('❌ Error calling token generation function:', error);
          console.error('❌ Error type:', error?.constructor?.name);
          console.error('❌ Error message:', error?.message);
          console.error('❌ Error stack:', error?.stack);
          console.error('');
          
          if (error?.message?.includes('Failed to send a request') || 
              error?.name === 'FunctionsFetchError') {
            console.error('🔴 This is a connection error - the function is not deployed or unreachable.');
            console.error('');
            console.error('📋 TO FIX:');
            console.error('   1. Run: supabase functions deploy generate-agora-token');
            console.error('   2. Verify: Supabase Dashboard → Edge Functions');
            console.error('   3. Check: Network connectivity and Supabase URL configuration');
            console.error('');
            toast.error('Cannot reach token service. Please deploy the edge function.');
          } else {
            console.error('🔴 CRITICAL: Edge function may not be deployed!');
            console.error('🔴 Run: supabase functions deploy generate-agora-token');
            toast.error('Token generation failed. Please check deployment.');
          }
          
          // Throw error to prevent joining with null token
          throw new Error('Token generation failed: ' + (error?.message || 'Unknown error'));
        }
      }

      // Create Agora client
      const client = createClient();
      clientRef.current = client;

      // Set up event listeners
      client.on('user-published', (user, mediaType) => {
        console.log('👤 Remote user published:', user.uid, mediaType);
        
        client.subscribe(user, mediaType).then(() => {
          // Handle audio tracks - ensure they play
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            console.log('✅ Playing remote audio track');
          }

          // Update remote users list - merge tracks for same user
          setCallState(prev => {
            const existingUser = prev.remoteUsers.find(u => u.uid === user.uid);
            if (existingUser) {
              // Update existing user with new track
              return {
                ...prev,
                remoteUsers: prev.remoteUsers.map(u => 
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

          // Play remote video if it's a video call
          if (mediaType === 'video' && remoteVideoRef.current) {
            user.videoTrack?.play(remoteVideoRef.current);
            console.log('✅ Playing remote video track');
          }
        }).catch((error) => {
          console.error('❌ Error subscribing to remote user:', error);
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
        
        // Update state - only remove user if they've unpublished all tracks
        setCallState(prev => {
          const existingUser = prev.remoteUsers.find(u => u.uid === user.uid);
          if (existingUser) {
            // Check if user has any remaining tracks
            const hasAudio = mediaType !== 'audio' && existingUser.audioTrack;
            const hasVideo = mediaType !== 'video' && existingUser.videoTrack;
            
            if (!hasAudio && !hasVideo) {
              // Remove user if no tracks remain
              return {
                ...prev,
                remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
              };
            } else {
              // Keep user but update their tracks
              return {
                ...prev,
                remoteUsers: prev.remoteUsers.map(u => 
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
        
        setCallState(prev => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
        }));
      });

      // DEBUG: Log token value RIGHT BEFORE joining
      const actualAppId = AGORA_CONFIG.APP_ID;
      console.log('');
      console.log('🔍 ========================================');
      console.log('🔍 CALL JOIN ATTEMPT - DETAILED INFO');
      console.log('🔍 ========================================');
      console.log('   Channel Name:', callRequest.channel_name);
      console.log('   Call Type:', callRequest.call_type);
      console.log('   UID:', uid);
      console.log('');
      console.log('   🔑 APP ID:');
      console.log('      Value:', actualAppId);
      console.log('      Length:', actualAppId?.length || 0);
      console.log('      From Env:', import.meta.env.VITE_AGORA_APP_ID || 'NOT SET');
      console.log('      From Config:', AGORA_CONFIG.APP_ID);
      console.log('');
      console.log('   🎫 TOKEN:');
      console.log('      Value:', token ? `${token.substring(0, 20)}...` : 'NULL');
      console.log('      Type:', typeof token);
      console.log('      Length:', token ? token.length : 0);
      console.log('      Has Token:', !!token);
      console.log('      Is Null:', token === null);
      console.log('');
      console.log('   ⚠️ If error occurs, verify:');
      console.log('      1. App ID matches Agora Console');
      console.log('      2. App ID is 32 characters');
      console.log('      3. Project exists in your Agora account');
      console.log('🔍 ========================================');
      console.log('');

      // Join the call with the token (generated or existing)
      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callRequest.channel_name,
          callType: callRequest.call_type as CallType,
          token: token,
          uid: uid
        },
        client
      );

      // Play local video if it's a video call
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.play(localVideoRef.current);
      }

      // Update call state
      setCallState(prev => ({
        ...prev,
        client,
        localAudioTrack,
        localVideoTrack,
        isJoined: true
      }));

      setCallStartTime(new Date());
      setIsConnecting(false);
      
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
      if (clientRef.current && callState.localAudioTrack) {
        await leaveCall(clientRef.current, callState.localAudioTrack, callState.localVideoTrack);
      }
      
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

      // Update call session in database
      if (callStartTime) {
        const duration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
        
        await supabase
          .from('call_sessions')
          .insert({
            id: crypto.randomUUID(),
            user_id: callRequest.user_id,
            expert_id: Math.floor(Math.random() * 1000000), // You'll need to get actual expert ID
            channel_name: callRequest.channel_name,
            agora_channel_name: callRequest.channel_name,
            call_type: callRequest.call_type,
            status: 'completed',
            duration,
            start_time: callStartTime.toISOString(),
            end_time: new Date().toISOString(),
            call_direction: 'incoming'
          });
      }

      onCallEnd();
      toast.success('Call ended');
    } catch (error) {
      console.error('❌ Error leaving call:', error);
      toast.error('Error ending call');
    }
  };

  // Toggle microphone
  const handleToggleMute = () => {
    if (callState.localAudioTrack) {
      const newMutedState = toggleMute(callState.localAudioTrack, callState.isMuted);
      setCallState(prev => ({ ...prev, isMuted: newMutedState }));
    }
  };

  // Toggle video
  const handleToggleVideo = () => {
    if (callState.localVideoTrack) {
      const newVideoState = toggleVideo(callState.localVideoTrack, callState.isVideoEnabled);
      setCallState(prev => ({ ...prev, isVideoEnabled: newVideoState }));
    }
  };

  // Update call duration timer
  useEffect(() => {
    if (!callStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000);
      setCallDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  // Auto-join call on mount
  useEffect(() => {
    handleJoinCall();
    
    return () => {
      if (clientRef.current && callState.localAudioTrack) {
        leaveCall(clientRef.current, callState.localAudioTrack, callState.localVideoTrack);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  const userDisplayName = callRequest.user_metadata?.name || 'Anonymous User';
  const userAvatar = callRequest.user_metadata?.avatar || null;
  const estimatedCost = callRequest.estimated_cost_inr || callRequest.estimated_cost_usd || 0;
  const currency = callRequest.estimated_cost_inr ? 'INR' : 'EUR';
  const currencySymbol = currency === 'INR' ? '₹' : '€';

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {callRequest.call_type === 'video' ? (
              <Video className="w-5 h-5" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
            <span>Active {callRequest.call_type === 'video' ? 'Video' : 'Audio'} Call</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="bg-green-600">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(callDuration)}
            </Badge>
            
            {estimatedCost > 0 && (
              <Badge variant="outline">
                <DollarSign className="w-3 h-3 mr-1" />
                ${estimatedCost.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex items-center justify-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userAvatar} alt={userDisplayName} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-medium">{userDisplayName}</h3>
            <p className="text-sm text-muted-foreground">
              {callState.remoteUsers.length > 0 ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Video Area */}
        {callRequest.call_type === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div ref={localVideoRef} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                You
              </div>
              {!callState.isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Remote Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div ref={remoteVideoRef} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {userDisplayName}
              </div>
              {callState.remoteUsers.length === 0 && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                  <span className="ml-2 text-gray-400">Waiting for user...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center space-x-4">
          {isConnecting ? (
            <Button disabled>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </Button>
          ) : callState.isJoined ? (
            <>
              <Button
                variant={callState.isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={handleToggleMute}
              >
                {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {callRequest.call_type === 'video' && (
                <Button
                  variant={callState.isVideoEnabled ? "outline" : "destructive"}
                  size="lg"
                  onClick={handleToggleVideo}
                >
                  {callState.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}

              <Button
                variant="destructive"
                size="lg"
                onClick={handleLeaveCall}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
            </>
          ) : (
            <Button onClick={handleJoinCall}>
              <Phone className="w-4 h-4 mr-2" />
              Rejoin Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgoraCallInterface;