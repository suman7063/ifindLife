
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Clock, 
  DollarSign,
  Maximize,
  Minimize
} from 'lucide-react';
import { CallState } from '@/hooks/call/useCallState';

export interface AgoraCallControlsProps {
  callState: CallState;
  callType: 'audio' | 'video';
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat: () => void;
  showChat: boolean;
  remainingSeconds: number;
  onExtendCall: () => void;
  isExtending: boolean;
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
  isExtending,
  isFullscreen,
  onToggleFullscreen
}) => {
  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          size="icon" 
          className={callState.isMuted ? "bg-red-100" : ""} 
          onClick={onToggleMute}
        >
          {callState.isMuted ? (
            <MicOff className="h-5 w-5 text-red-500" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        {callType === 'video' && (
          <Button 
            variant="outline"
            size="icon" 
            className={!callState.isVideoEnabled ? "bg-red-100" : ""} 
            onClick={onToggleVideo}
          >
            {!callState.isVideoEnabled ? (
              <VideoOff className="h-5 w-5 text-red-500" />
            ) : (
              <Video className="h-5 w-5" />
            )}
          </Button>
        )}
        
        <Button
          variant="outline" 
          size="icon"
          className={showChat ? "bg-ifind-aqua/10" : ""}
          onClick={onToggleChat}
        >
          <MessageSquare className={`h-5 w-5 ${showChat ? "text-ifind-aqua" : ""}`} />
        </Button>
        
        {onToggleFullscreen && (
          <Button
            variant="outline" 
            size="icon"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatRemainingTime(remainingSeconds)}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExtendCall}
          disabled={isExtending}
          className="bg-white hover:bg-gray-50"
        >
          <DollarSign className="h-4 w-4 mr-1" />
          <span>Extend</span>
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onEndCall}
          className="hover:bg-red-600"
        >
          <PhoneOff className="h-4 w-4 mr-1" />
          <span>End Call</span>
        </Button>
      </div>
    </div>
  );
};

export default AgoraCallControls;
