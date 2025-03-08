
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PhoneCall, PhoneOff, Mic, MicOff } from 'lucide-react';
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
  const [balance, setBalance] = useState(500); // Dummy balance in wallet (₹)
  
  // Handle call connection
  useEffect(() => {
    if (isOpen && callStatus === 'connecting') {
      const timer = setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: "Call Connected",
          description: `You are now connected with ${astrologer.name}`,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, callStatus, astrologer.name]);
  
  // Handle call duration and balance update
  useEffect(() => {
    let intervalId: number;
    
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
    }, 1500);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      description: isMuted ? "Microphone unmuted" : "Microphone muted",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'connecting' ? 'Connecting...' : 
             callStatus === 'connected' ? 'On Call' : 'Call Ended'}
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
          <div className="relative">
            <div className={`h-24 w-24 rounded-full overflow-hidden border-4 ${
              callStatus === 'connecting' ? 'border-yellow-400 animate-pulse' : 
              callStatus === 'connected' ? 'border-green-500' : 'border-red-500'
            }`}>
              <img 
                src={astrologer.imageUrl} 
                alt={astrologer.name} 
                className="h-full w-full object-cover"
              />
            </div>
            {callStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-20 w-20 border-4 border-astro-purple border-t-transparent rounded-full"></div>
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
            <Button 
              onClick={toggleMute} 
              variant="outline" 
              className={`rounded-full p-4 ${isMuted ? 'bg-red-100 border-red-300' : ''}`}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          )}
          
          {callStatus !== 'ended' ? (
            <Button 
              onClick={handleEndCall} 
              variant="destructive" 
              className="rounded-full p-4"
            >
              <PhoneOff className="h-6 w-6" />
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
