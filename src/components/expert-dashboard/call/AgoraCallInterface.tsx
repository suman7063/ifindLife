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
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';

interface AgoraCallInterfaceProps {
  callRequest: {
    id: string;
    user_id: string;
    call_type: 'audio' | 'video';
    channel_name: string;
    agora_token: string | null;
    agora_uid: number | null;
    estimated_cost_usd: number | null;
    user_metadata: any;
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
      console.log('🔗 Joining Agora call...', callRequest);

      // Create Agora client
      const client = createClient();
      clientRef.current = client;

      // Set up event listeners
      client.on('user-published', (user, mediaType) => {
        console.log('👤 User published:', user.uid, mediaType);
        
        client.subscribe(user, mediaType).then(() => {
          setCallState(prev => ({
            ...prev,
            remoteUsers: [...prev.remoteUsers.filter(u => u.uid !== user.uid), user]
          }));

          // Play remote video if it's a video call
          if (mediaType === 'video' && remoteVideoRef.current) {
            user.videoTrack?.play(remoteVideoRef.current);
          }
        });
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log('👤 User unpublished:', user.uid, mediaType);
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

      // Join the call
      const { localAudioTrack, localVideoTrack } = await joinCall(
        {
          channelName: callRequest.channel_name,
          callType: callRequest.call_type as CallType,
          token: callRequest.agora_token,
          uid: callRequest.agora_uid || undefined
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
  }, []);

  const userDisplayName = callRequest.user_metadata?.name || 'Anonymous User';
  const userAvatar = callRequest.user_metadata?.avatar || null;
  const estimatedCost = callRequest.estimated_cost_usd || 0;

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