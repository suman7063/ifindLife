
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle,
  Maximize,
  Minimize,
  PlusCircle
} from 'lucide-react';
import { CallState } from '@/utils/agoraService';
import { toast } from 'sonner';

interface AgoraCallControlButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  title: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

const AgoraCallControlButton: React.FC<AgoraCallControlButtonProps> = ({
  onClick,
  active = false,
  icon,
  activeIcon,
  title,
  variant = "outline",
  className = ""
}) => {
  const displayIcon = active && activeIcon ? activeIcon : icon;
  const buttonClass = `rounded-full p-3 ${className} ${active ? 'bg-red-100 border-red-300' : ''}`;
  
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={buttonClass}
      title={title}
    >
      {displayIcon}
    </Button>
  );
};

interface AgoraCallControlsProps {
  callState: CallState;
  callType: 'audio' | 'video';
  isExtending: boolean;
  isFullscreen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onExtendCall: () => void;
  onToggleChat: () => void;
  onToggleFullscreen: () => void;
}

const AgoraCallControls: React.FC<AgoraCallControlsProps> = ({
  callState,
  callType,
  isExtending,
  isFullscreen,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onExtendCall,
  onToggleChat,
  onToggleFullscreen
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 p-2 bg-background/80 rounded-lg backdrop-blur-sm">
      {callState.isJoined && (
        <>
          <AgoraCallControlButton
            onClick={onToggleMute}
            active={callState.isMuted}
            icon={<Mic className="h-5 w-5" />}
            activeIcon={<MicOff className="h-5 w-5" />}
            title={callState.isMuted ? "Unmute microphone" : "Mute microphone"}
          />
          
          {callType === 'video' && (
            <AgoraCallControlButton
              onClick={onToggleVideo}
              active={!callState.isVideoEnabled}
              icon={<Video className="h-5 w-5" />}
              activeIcon={<VideoOff className="h-5 w-5" />}
              title={callState.isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            />
          )}
          
          <AgoraCallControlButton
            onClick={onToggleChat}
            icon={<MessageCircle className="h-5 w-5" />}
            title="Toggle chat"
          />
          
          <AgoraCallControlButton
            onClick={onToggleFullscreen}
            icon={isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          />
          
          {isExtending && (
            <AgoraCallControlButton
              onClick={onExtendCall}
              icon={<PlusCircle className="h-5 w-5 text-green-600" />}
              className="bg-green-100 border-green-300"
              title="Extend call by 15 minutes"
            />
          )}
        </>
      )}
      
      <AgoraCallControlButton
        onClick={onEndCall}
        icon={<PhoneOff className="h-5 w-5" />}
        variant="destructive"
        title="End call"
      />
    </div>
  );
};

export default AgoraCallControls;
