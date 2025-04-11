
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Clock, Plus, Maximize, Minimize } from 'lucide-react';
import { CallState } from '@/hooks/call/useCallState';

export interface AgoraCallControlsProps {
  callState: CallState;
  callType: 'audio' | 'video';
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat: () => void;
  showChat: boolean;
  remainingSeconds?: number;
  onExtendCall?: () => void;
  isExtending?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const AgoraCallControls: React.FC<AgoraCallControlsProps> = ({
  callState,
  callType,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  showChat,
  remainingSeconds,
  onExtendCall,
  isExtending = false,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const formatTime = (seconds?: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm border-t p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onToggleMute}
          className={callState.isMuted ? 'bg-red-100 text-red-600 border-red-300' : ''}
        >
          {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        {callType === 'video' && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleVideo}
            className={!callState.isVideoEnabled ? 'bg-red-100 text-red-600 border-red-300' : ''}
          >
            {callState.isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {remainingSeconds !== undefined && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{formatTime(remainingSeconds)}</span>
            
            {onExtendCall && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 p-1 h-7" 
                onClick={onExtendCall}
                disabled={isExtending}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onEndCall}
          className="rounded-full px-4"
        >
          <PhoneOff className="h-4 w-4 mr-1" />
          End
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleChat}
          className={showChat ? 'bg-primary/10 text-primary' : ''}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        {onToggleFullscreen && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AgoraCallControls;
