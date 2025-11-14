/**
 * In Call Modal
 * Main interface during active call
 */

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  WifiOff,
  RotateCcw,
  MessageSquare,
  MessageSquareOff
} from 'lucide-react';
import type { CallState } from '@/utils/agoraService';
import CallChat from '@/components/call/CallChat';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface InCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertAvatar?: string;
  callType: 'audio' | 'video';
  callState: CallState;
  duration: number;
  showRejoin: boolean;
  wasDisconnected: boolean;
  expertEndedCall: boolean;
  isConnecting: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onRejoin: () => void;
  onEndCallFromRejoin: () => void;
  localVideoRef: React.RefObject<HTMLDivElement>;
  remoteVideoRef: React.RefObject<HTMLDivElement>;
}

const InCallModal: React.FC<InCallModalProps> = ({
  isOpen,
  onClose,
  expertName,
  expertAvatar,
  callType,
  callState,
  duration,
  showRejoin,
  wasDisconnected,
  expertEndedCall,
  isConnecting,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onRejoin,
  onEndCallFromRejoin,
  localVideoRef,
  remoteVideoRef
}) => {
  const { user } = useSimpleAuth();
  const [showChat, setShowChat] = useState(false);
  const userName = user?.name || user?.email || 'You';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // Play local video when available - trigger immediately when modal opens or state changes
  useEffect(() => {
    if (callType === 'video' && callState?.localVideoTrack && localVideoRef.current) {
      const playVideo = async () => {
        // Only play if video is enabled
        if (!callState.isVideoEnabled) {
          console.log('📹 Video track exists but is disabled');
          return;
        }

        try {
          // Ensure video track is enabled
          if (!callState.localVideoTrack!.enabled) {
            callState.localVideoTrack!.setEnabled(true);
            console.log('✅ Enabled local video track');
          }
          
          // Check if video is already playing on this element
          const existingVideo = localVideoRef.current.querySelector('video');
          if (existingVideo && !existingVideo.paused && existingVideo.videoWidth > 0) {
            console.log('✅ Video already playing on this element');
            return;
          }
          
          // Play on the ref element
          await callState.localVideoTrack!.play(localVideoRef.current!, { mirror: true });
          console.log('✅ Playing local video track in modal');
        } catch (error) {
          console.warn('⚠️ Could not play local video:', error);
          // Retry after a short delay
          setTimeout(async () => {
            if (callState?.localVideoTrack && localVideoRef.current && callState.isVideoEnabled) {
              try {
                await callState.localVideoTrack.play(localVideoRef.current, { mirror: true });
                console.log('✅ Retry: Playing local video track');
              } catch (retryError) {
                console.error('❌ Retry failed:', retryError);
              }
            }
          }, 500);
        }
      };
      
      // Use requestAnimationFrame for better timing
      const rafId = requestAnimationFrame(() => {
        setTimeout(playVideo, 50);
      });
      
      return () => cancelAnimationFrame(rafId);
    }
  }, [callType, callState?.localVideoTrack, callState?.isVideoEnabled, localVideoRef, isOpen]);

  // Play remote video when available
  useEffect(() => {
    if (callType === 'video' && callState?.remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = callState.remoteUsers[0];
      if (remoteUser.videoTrack) {
        try {
          remoteUser.videoTrack.play(remoteVideoRef.current);
          console.log('✅ Playing remote video track');
        } catch (error) {
          console.warn('⚠️ Could not play remote video:', error);
        }
      }
    }
  }, [callType, callState?.remoteUsers, remoteVideoRef]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${showChat ? 'sm:max-w-6xl' : 'sm:max-w-4xl'} max-h-[90vh] overflow-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Call with {expertName}</span>
          </DialogTitle>
          <DialogDescription>
            {expertEndedCall ? 'Call ended by expert' : `Connected - Duration: ${formatTime(duration)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Lost / Rejoin */}
          {showRejoin && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <WifiOff className="h-12 w-12 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Connection Lost</h3>
                    <p className="text-sm text-muted-foreground">
                      Your connection was interrupted. You can rejoin the call or end it.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onEndCallFromRejoin}>
                      End Call
                    </Button>
                    <Button onClick={onRejoin}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rejoin Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Display */}
          {callType === 'video' && (
            <div className={`flex ${showChat ? 'flex-row gap-4' : 'flex-col'} items-start`}>
              <div className={`${showChat ? 'flex-1' : 'w-full'}`}>
                <div className="grid grid-cols-2 gap-4 h-[400px]">
                  {/* Remote Video */}
                  <Card className="relative overflow-hidden bg-black">
                    <CardContent className="p-0 h-full">
                      <div ref={remoteVideoRef} className="w-full h-full" />
                      {!callState.remoteUsers.length && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={expertAvatar} />
                            <AvatarFallback>{expertName[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {expertName}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Local Video */}
                  <Card className="relative overflow-hidden bg-black">
                    <CardContent className="p-0 h-full">
                      <div 
                        ref={localVideoRef} 
                        className="w-full h-full min-h-[200px]"
                        style={{ minHeight: '200px' }}
                      />
                      {!callState?.localVideoTrack && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      {callState?.localVideoTrack && !callState.isVideoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                          <VideoOff className="h-12 w-12 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        You {callState?.isVideoEnabled ? '(Video On)' : '(Video Off)'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Chat Panel - Always render to preserve messages */}
              {callState?.client && (
                <div className={`flex-1 min-w-0 ${showChat ? '' : 'hidden'}`}>
                  <Card className="border border-border/50 shadow-inner">
                    <CardContent className="p-0">
                      <CallChat
                        visible={showChat}
                        client={callState.client}
                        userName={userName}
                        expertName={expertName}
                        expertAvatar={expertAvatar}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Audio Call Display */}
          {callType === 'audio' && (
            <div className={`flex ${showChat ? 'flex-row gap-4' : 'flex-col'} items-start`}>
              <div className={`${showChat ? 'flex-1' : 'w-full'}`}>
                <Card>
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={expertAvatar} />
                        <AvatarFallback>{expertName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">{expertName}</h3>
                        <p className="text-sm text-muted-foreground">Audio Call</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Panel - Always render to preserve messages */}
              {callState?.client && (
                <div className={`flex-1 min-w-0 ${showChat ? '' : 'hidden'}`}>
                  <Card className="border border-border/50 shadow-inner">
                    <CardContent className="p-0">
                      <CallChat
                        visible={showChat}
                        client={callState.client}
                        userName={userName}
                        expertName={expertName}
                        expertAvatar={expertAvatar}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Call Controls */}
          {!showRejoin && (
            <div className="flex justify-center space-x-4">
              <Button
                variant={callState?.isMuted ? 'destructive' : 'outline'}
                size="lg"
                onClick={() => {
                  console.log('🔇 Mute button clicked', {
                    hasCallState: !!callState,
                    hasAudioTrack: !!callState?.localAudioTrack,
                    isMuted: callState?.isMuted,
                    audioTrackEnabled: callState?.localAudioTrack?.enabled
                  });
                  if (callState?.localAudioTrack) {
                    onToggleMute();
                  } else {
                    console.error('❌ Cannot toggle mute: audio track not available');
                  }
                }}
                disabled={!callState?.localAudioTrack || !callState?.isJoined}
                title={callState?.isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {callState?.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {callType === 'video' && (
                <Button
                  variant={callState?.isVideoEnabled ? 'outline' : 'destructive'}
                  size="lg"
                  onClick={onToggleVideo}
                  disabled={!callState?.localVideoTrack}
                >
                  {callState?.isVideoEnabled ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </Button>
              )}

              <Button
                variant={showChat ? 'default' : 'outline'}
                size="lg"
                onClick={toggleChat}
                title={showChat ? 'Hide chat' : 'Show chat'}
                disabled={!callState?.client || callState?.client?.connectionState !== 'CONNECTED'}
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
                onClick={onEndCall}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InCallModal;

