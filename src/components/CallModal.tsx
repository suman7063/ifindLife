
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PhoneCall, PhoneOff, Mic, MicOff, Video, VideoOff, Camera, CameraOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  astrologer: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, astrologer }) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [balance, setBalance] = useState(500); // Dummy balance in wallet (₹)
  
  // Handle call connection
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isOpen && callStatus === 'connecting') {
      timer = setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: "Video Call Connected",
          description: `You are now connected with ${astrologer.name}`,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, callStatus, astrologer.name]);
  
  // Handle call duration and balance update
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (callStatus === 'connected') {
      intervalId = setInterval(() => {
        setDuration(prev => prev + 1);
        // Deduct balance based on price per minute (converting to per second)
        setBalance(prev => {
          const newBalance = prev - (astrologer.price / 60);
          // End call if balance is low
          if (newBalance <= 50) {
            setCallStatus('ended');
            toast({
              title: "Low Balance",
              description: "Call ended due to low balance",
              variant: "destructive"
            });
            clearInterval(intervalId);
          }
          return newBalance;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [callStatus, astrologer.price]);
  
  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle end call
  const handleEndCall = () => {
    setCallStatus('ended');
    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(duration)}`,
    });
    
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
      // Reset state for next call
      setCallStatus('connecting');
      setDuration(0);
      setIsMuted(false);
      setIsVideoOn(true);
      setIsCameraOn(true);
    }, 1500);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      description: isMuted ? "Microphone unmuted" : "Microphone muted",
    });
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      description: isVideoOn ? "Video paused" : "Video resumed",
    });
  };
  
  // Toggle camera
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast({
      description: isCameraOn ? "Camera turned off" : "Camera turned on",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'connecting' ? 'Connecting...' : 
             callStatus === 'connected' ? 'Video Call' : 'Call Ended'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {callStatus === 'connected' ? 
              `Connected with ${astrologer.name} (₹${astrologer.price}/min)` : 
              callStatus === 'ended' ? 
              `Call with ${astrologer.name} ended` : 
              `Connecting to ${astrologer.name}...`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-4">
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
          
          {callStatus === 'connected' && (
            <>
              <div className="text-2xl font-semibold">{formatDuration(duration)}</div>
              <div className="text-sm text-muted-foreground">
                Balance: ₹{balance.toFixed(2)}
              </div>
            </>
          )}
          
          {callStatus === 'ended' && (
            <div className="text-sm text-muted-foreground">
              Duration: {formatDuration(duration)}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-center space-x-4">
          {callStatus === 'connected' && (
            <>
              <Button 
                onClick={toggleMute} 
                variant="outline" 
                className={`rounded-full p-3 ${isMuted ? 'bg-red-100 border-red-300' : ''}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button 
                onClick={toggleCamera} 
                variant="outline" 
                className={`rounded-full p-3 ${!isCameraOn ? 'bg-red-100 border-red-300' : ''}`}
                title={isCameraOn ? "Turn off camera" : "Turn on camera"}
              >
                {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
              
              <Button 
                onClick={toggleVideo} 
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
              onClick={handleEndCall} 
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
