
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AgoraCallControlsProps {
  callState: any;
  callType?: 'audio' | 'video';
  videoMode?: 'side-by-side' | 'picture-in-picture';
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat?: () => void;
  onToggleVideoMode?: () => void;
  showChat?: boolean;
}

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

const AgoraCallControls: React.FC<AgoraCallControlsProps> = ({
  callState,
  callType,
  videoMode = 'side-by-side',
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  onToggleVideoMode,
  showChat = false
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl backdrop-blur-sm border border-primary/20 shadow-lg">
      {callState?.isJoined && (
        <>
          <AgoraCallControlButton
            onClick={onToggleMute}
            active={callState.isMuted}
            icon={<Mic className="h-5 w-5" />}
            activeIcon={<MicOff className="h-5 w-5" />}
            title={callState.isMuted ? "Unmute microphone" : "Mute microphone"}
            className={callState.isMuted ? "bg-destructive/20 border-destructive/40" : "hover:bg-primary/20"}
          />
          
          <AgoraCallControlButton
            onClick={onToggleVideo}
            active={!callState.isVideoEnabled}
            icon={<Video className="h-5 w-5" />}
            activeIcon={<VideoOff className="h-5 w-5" />}
            title={callState.isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            className={!callState.isVideoEnabled ? "bg-destructive/20 border-destructive/40" : "hover:bg-primary/20"}
          />
          
          {callType === 'video' && onToggleVideoMode && (
            <AgoraCallControlButton
              onClick={onToggleVideoMode}
              active={videoMode === 'picture-in-picture'}
              icon={<Minimize2 className="h-5 w-5" />}
              activeIcon={<Maximize2 className="h-5 w-5" />}
              title={videoMode === 'side-by-side' ? "Switch to Picture in Picture" : "Switch to Side by Side"}
              className="hover:bg-secondary/20"
            />
          )}
          
          {onToggleChat && (
            <AgoraCallControlButton
              onClick={onToggleChat}
              active={showChat}
              icon={<MessageCircle className="h-5 w-5" />}
              title="Toggle chat"
              className={showChat ? "bg-accent/20 border-accent/40" : "hover:bg-accent/20"}
            />
          )}
        </>
      )}
      
      <AgoraCallControlButton
        onClick={onEndCall}
        icon={<PhoneOff className="h-5 w-5" />}
        variant="destructive"
        title="End call"
        className="hover:bg-destructive/80"
      />
    </div>
  );
};

export default AgoraCallControls;
