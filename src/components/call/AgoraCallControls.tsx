
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
  PlusCircle
} from 'lucide-react';
import { CallState } from '@/utils/agoraService';
import { toast } from 'sonner';

interface AgoraCallControlsProps {
  callState: CallState;
  callType: 'audio' | 'video';
  isExtending: boolean;
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
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onExtendCall,
  onToggleChat,
  onToggleFullscreen
}) => {
  return (
    <div className="flex justify-center space-x-4">
      {callState.isJoined && (
        <>
          <Button 
            onClick={onToggleMute} 
            variant="outline" 
            className={`rounded-full p-3 ${callState.isMuted ? 'bg-red-100 border-red-300' : ''}`}
            title={callState.isMuted ? "Unmute" : "Mute"}
          >
            {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          {callType === 'video' && (
            <Button 
              onClick={onToggleVideo} 
              variant="outline" 
              className={`rounded-full p-3 ${!callState.isVideoEnabled ? 'bg-red-100 border-red-300' : ''}`}
              title={callState.isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {callState.isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          )}
          
          <Button 
            onClick={onToggleChat} 
            variant="outline" 
            className="rounded-full p-3"
            title="Open chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={onToggleFullscreen} 
            variant="outline" 
            className="rounded-full p-3"
            title="Fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </Button>
          
          {isExtending && (
            <Button 
              onClick={onExtendCall} 
              variant="outline" 
              className="rounded-full p-3 bg-green-100 border-green-300"
              title="Extend call by 15 minutes"
            >
              <PlusCircle className="h-5 w-5 text-green-600" />
            </Button>
          )}
        </>
      )}
      
      <Button 
        onClick={onEndCall} 
        variant="destructive" 
        className="rounded-full p-3"
        title="End call"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AgoraCallControls;
