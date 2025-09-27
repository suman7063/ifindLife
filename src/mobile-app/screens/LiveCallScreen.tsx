import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export const LiveCallScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        <div className="absolute top-6 left-6 right-6">
          <div className="text-center">
            <h1 className="text-white text-xl font-poppins font-semibold">Dr. Sarah Johnson</h1>
            <p className="text-white/80">Connected • 12:45</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-black/80">
        <div className="flex justify-center space-x-6">
          <Button size="lg" variant="ghost" className="w-16 h-16 rounded-full bg-white/20 text-white">
            <Mic className="h-6 w-6" />
          </Button>
          <Button size="lg" className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white">
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button size="lg" variant="ghost" className="w-16 h-16 rounded-full bg-white/20 text-white">
            <Video className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};