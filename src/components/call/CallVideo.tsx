
import React from 'react';
import { VideoOff, Camera } from 'lucide-react';

interface CallVideoProps {
  callStatus: 'connecting' | 'connected' | 'ended';
  isVideoOn: boolean;
  isCameraOn: boolean;
  astrologer: {
    name: string;
    imageUrl: string;
  };
}

const CallVideo: React.FC<CallVideoProps> = ({ callStatus, isVideoOn, isCameraOn, astrologer }) => {
  return (
    <div className="relative w-full max-w-sm aspect-video bg-slate-900 rounded-lg overflow-hidden">
      {/* Astrologer video (simulated) */}
      {callStatus !== 'ended' && isVideoOn && (
        <div className="w-full h-full">
          <img 
            src={astrologer.imageUrl} 
            alt={astrologer.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
            {astrologer.name}
          </div>
        </div>
      )}
      
      {(!isVideoOn || callStatus === 'ended') && (
        <div className="w-full h-full flex items-center justify-center bg-slate-800">
          <VideoOff className="h-12 w-12 text-white/50" />
        </div>
      )}
      
      {/* User camera (simulated) */}
      {callStatus !== 'ended' && isCameraOn && (
        <div className="absolute bottom-2 right-2 w-24 h-32 bg-slate-700 rounded overflow-hidden border-2 border-white/20">
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-white/70" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CallVideo;
