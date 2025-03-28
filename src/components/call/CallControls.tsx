
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Camera, CameraOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CallControlsProps {
  callStatus: 'connecting' | 'connected' | 'ended';
  isMuted: boolean;
  isVideoOn: boolean;
  isCameraOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
  onClose: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  callStatus,
  isMuted,
  isVideoOn,
  isCameraOn,
  onToggleMute,
  onToggleVideo,
  onToggleCamera,
  onEndCall,
  onClose
}) => {
  return (
    <div className="flex justify-center space-x-4">
      {callStatus === 'connected' && (
        <>
          <Button 
            onClick={onToggleMute} 
            variant="outline" 
            className={`rounded-full p-3 ${isMuted ? 'bg-red-100 border-red-300' : ''}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            onClick={onToggleCamera} 
            variant="outline" 
            className={`rounded-full p-3 ${!isCameraOn ? 'bg-red-100 border-red-300' : ''}`}
            title={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            onClick={onToggleVideo} 
            variant="outline" 
            className={`rounded-full p-3 ${!isVideoOn ? 'bg-red-100 border-red-300' : ''}`}
            title={isVideoOn ? "Pause video" : "Resume video"}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
        </>
      )}
      
      {callStatus !== 'ended' ? (
        <Button 
          onClick={onEndCall} 
          variant="destructive" 
          className="rounded-full p-3"
          title="End call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      ) : (
        <Button 
          onClick={onClose} 
          className="bg-astro-purple hover:bg-astro-violet"
        >
          Close
        </Button>
      )}
    </div>
  );
};

export default CallControls;
