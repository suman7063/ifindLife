import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, VideoOff, Mic, MicOff, Eye } from 'lucide-react';

interface DemoVideoPreviewProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isMuted: boolean;
  userName: string;
  expertName: string;
  hasRemoteUser: boolean;
  callStatus: 'connecting' | 'connected';
}

const DemoVideoPreview: React.FC<DemoVideoPreviewProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  isMuted,
  userName,
  expertName,
  hasRemoteUser,
  callStatus
}) => {
  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg overflow-hidden">
      {/* Demo mode indicator */}
      <Badge variant="secondary" className="absolute top-2 left-2 z-10 flex items-center gap-1">
        <Eye className="w-3 h-3" />
        Demo
      </Badge>

      {/* Remote user (expert) area */}
      <div className="w-full h-full flex items-center justify-center">
        {callStatus === 'connecting' ? (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarFallback className="text-2xl bg-primary/10">
                  {expertName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Connecting to {expertName}...</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : hasRemoteUser ? (
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl bg-primary/20">
                {expertName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="font-medium">{expertName}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant={isAudioEnabled ? "default" : "secondary"} className="text-xs">
                  {isAudioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                </Badge>
                {isVideoEnabled && (
                  <Badge variant="default" className="text-xs">
                    <Video className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Waiting for {expertName} to join...</p>
          </div>
        )}
      </div>

      {/* Local user preview (picture-in-picture) */}
      <Card className="absolute bottom-4 right-4 w-32 h-24 p-2 bg-background/80 backdrop-blur-sm">
        <div className="w-full h-full flex items-center justify-center relative">
          {isVideoEnabled ? (
            <div className="text-center">
              <Avatar className="w-8 h-8 mx-auto mb-1">
                <AvatarFallback className="text-xs bg-secondary">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">You</p>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Camera off</p>
            </div>
          )}
          
          {/* Mute indicator */}
          {isMuted && (
            <div className="absolute top-1 right-1">
              <MicOff className="w-3 h-3 text-destructive" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DemoVideoPreview;