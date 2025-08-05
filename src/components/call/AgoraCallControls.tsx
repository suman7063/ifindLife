
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle,
  PictureInPicture,
  Grid2X2
} from 'lucide-react';

interface AgoraCallControlsProps {
  callState: any;
  callType?: 'audio' | 'video';
  isFullscreen?: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat?: () => void;
  onToggleVideoMode?: () => void;
  onToggleFullscreen?: () => void;
  showChat?: boolean;
  videoMode?: 'side-by-side' | 'picture-in-picture';
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
  const activeClass = active 
    ? 'bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/40 shadow-[var(--glow-accent)]' 
    : 'hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10';
  const buttonClass = `rounded-full p-3 ${className} ${activeClass} transition-all duration-300`;
  
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
  isFullscreen = false,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  onToggleVideoMode,
  onToggleFullscreen,
  showChat = false,
  videoMode = 'picture-in-picture'
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl backdrop-blur-sm border border-primary/20 shadow-[var(--glow-accent)]">
      {callState?.isJoined && (
        <>
          <AgoraCallControlButton
            onClick={onToggleMute}
            active={callState.isMuted}
            icon={<Mic className="h-5 w-5" />}
            activeIcon={<MicOff className="h-5 w-5" />}
            title={callState.isMuted ? "Unmute microphone" : "Mute microphone"}
            className="hover:shadow-[var(--glow-primary)] transition-all duration-200"
          />
          
          <AgoraCallControlButton
            onClick={onToggleVideo}
            active={!callState.isVideoEnabled}
            icon={<Video className="h-5 w-5" />}
            activeIcon={<VideoOff className="h-5 w-5" />}
            title={callState.isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            className="hover:shadow-[var(--glow-primary)] transition-all duration-200"
          />
          
          {onToggleVideoMode && callType === 'video' && (
            <AgoraCallControlButton
              onClick={onToggleVideoMode}
              active={videoMode === 'side-by-side'}
              icon={<PictureInPicture className="h-5 w-5" />}
              activeIcon={<Grid2X2 className="h-5 w-5" />}
              title={videoMode === 'picture-in-picture' ? "Switch to side-by-side" : "Switch to picture-in-picture"}
              className="hover:shadow-[var(--glow-accent)] transition-all duration-200"
            />
          )}
          
          {onToggleChat && (
            <AgoraCallControlButton
              onClick={onToggleChat}
              active={showChat}
              icon={<MessageCircle className="h-5 w-5" />}
              title="Toggle chat"
              className="hover:shadow-[var(--glow-accent)] transition-all duration-200"
            />
          )}
        </>
      )}
      
      <AgoraCallControlButton
        onClick={onEndCall}
        icon={<PhoneOff className="h-5 w-5" />}
        variant="destructive"
        title="End call"
        className="hover:shadow-lg transition-all duration-200"
      />
    </div>
  );
};

export default AgoraCallControls;
