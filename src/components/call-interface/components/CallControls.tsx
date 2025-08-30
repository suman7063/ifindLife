import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  MessageSquareOff,
  Phone,
  PhoneOff
} from 'lucide-react';
import { CallType } from '../CallInterface';

interface CallControlsProps {
  callType: CallType;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  callType,
  isMuted,
  isVideoEnabled,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleChat,
  onEndCall
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Mute Toggle */}
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="lg"
        onClick={onToggleMute}
        className="w-12 h-12 rounded-full"
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      {/* Video Toggle (only for video calls) */}
      {callType === 'video' && (
        <Button
          variant={!isVideoEnabled ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleVideo}
          className="w-12 h-12 rounded-full"
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
      )}

      {/* Chat Toggle */}
      <Button
        variant={isChatOpen ? "default" : "secondary"}
        size="lg"
        onClick={onToggleChat}
        className="w-12 h-12 rounded-full"
      >
        {isChatOpen ? <MessageSquareOff className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </Button>

      {/* End Call */}
      <Button
        variant="destructive"
        size="lg"
        onClick={onEndCall}
        className="w-12 h-12 rounded-full bg-destructive hover:bg-destructive/90"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};