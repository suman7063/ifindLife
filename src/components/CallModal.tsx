
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import CallVideo from './call/CallVideo';
import CallTimer from './call/CallTimer';
import CallBalance from './call/CallBalance';
import CallControls from './call/CallControls';

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
  
  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <CallVideo 
            callStatus={callStatus}
            isVideoOn={isVideoOn}
            isCameraOn={isCameraOn}
            astrologer={{
              name: astrologer.name,
              imageUrl: astrologer.imageUrl
            }}
          />
          
          <CallTimer callStatus={callStatus} duration={duration} />
          <CallBalance callStatus={callStatus} balance={balance} />
        </div>
        
        <DialogFooter className="flex justify-center space-x-4">
          <CallControls
            callStatus={callStatus}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isCameraOn={isCameraOn}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleCamera={toggleCamera}
            onEndCall={handleEndCall}
            onClose={onClose}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
