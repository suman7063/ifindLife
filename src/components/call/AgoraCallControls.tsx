
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle,
  PlusCircle
} from 'lucide-react';

interface AgoraCallControlsProps {
  callState: any;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat: () => void;
  onExtendCall: () => void;
  showChat: boolean;
  isExtending: boolean;
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
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onExtendCall,
  onToggleChat,
  showChat,
  isExtending
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 p-2 bg-background/80 rounded-lg backdrop-blur-sm">
      {callState?.isJoined && (
        <>
          <AgoraCallControlButton
            onClick={onToggleMute}
            active={callState.isMuted}
            icon={<Mic className="h-5 w-5" />}
            activeIcon={<MicOff className="h-5 w-5" />}
            title={callState.isMuted ? "Unmute microphone" : "Mute microphone"}
          />
          
          <AgoraCallControlButton
            onClick={onToggleVideo}
            active={!callState.isVideoEnabled}
            icon={<Video className="h-5 w-5" />}
            activeIcon={<VideoOff className="h-5 w-5" />}
            title={callState.isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          />
          
          <AgoraCallControlButton
            onClick={onToggleChat}
            active={showChat}
            icon={<MessageCircle className="h-5 w-5" />}
            title="Toggle chat"
          />
          
          {!isExtending && (
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
