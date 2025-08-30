import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, VideoOff, MicOff, Camera } from 'lucide-react';
import { CallState, CallType, Expert } from '../CallInterface';

interface CallVideoContainerProps {
  expert: Expert;
  callState: CallState;
  callType: CallType;
  isVideoEnabled: boolean;
  isMuted: boolean;
}

export const CallVideoContainer: React.FC<CallVideoContainerProps> = ({
  expert,
  callState,
  callType,
  isVideoEnabled,
  isMuted
}) => {
  const renderConnectingState = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Connecting...</h3>
          <p className="text-muted-foreground">Please wait while we connect you to {expert.name}</p>
        </div>
      </div>
    </div>
  );

  const renderRemoteVideo = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-accent/90 flex items-center justify-center">
      {callType === 'video' ? (
        <div className="text-center space-y-4">
          <Avatar className="h-32 w-32 mx-auto border-4 border-primary/30">
            <AvatarImage src={expert.imageUrl} alt={expert.name} />
            <AvatarFallback className="text-3xl">
              <User className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-primary-foreground">{expert.name}</h3>
            <Badge variant="secondary" className="mt-2">
              Connected
            </Badge>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="relative">
            <Avatar className="h-48 w-48 mx-auto border-4 border-primary/30">
              <AvatarImage src={expert.imageUrl} alt={expert.name} />
              <AvatarFallback className="text-6xl">
                <User className="h-24 w-24" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3">
              <MicOff className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-primary-foreground">{expert.name}</h3>
            <Badge variant="secondary" className="mt-2">
              Audio Call Active
            </Badge>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocalVideo = () => {
    if (callType === 'audio') return null;

    return (
      <div className="absolute bottom-4 right-4 w-32 h-40 bg-gradient-to-br from-secondary/90 to-accent/90 rounded-lg overflow-hidden border-2 border-primary/40 shadow-lg">
        {isVideoEnabled ? (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-primary-foreground" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <VideoOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute bottom-1 left-1 right-1 text-center">
          <span className="text-xs text-primary-foreground font-medium">You</span>
        </div>
        {isMuted && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <MicOff className="h-3 w-3" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden">
      {callState === 'connecting' ? renderConnectingState() : renderRemoteVideo()}
      {renderLocalVideo()}
    </div>
  );
};