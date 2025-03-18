
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAgora } from '@/hooks/auth/useAgora';
import { useUserAuth } from '@/hooks/useUserAuth';
import VideoCall from './VideoCall';

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
  const [balance, setBalance] = useState(500); // Dummy balance in wallet (₹)
  const { currentUser } = useUserAuth();
  const { useClient, useMicrophoneAndCameraTracks, startVideoSession, isLoading } = useAgora();
  
  const [videoSession, setVideoSession] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  
  // Agora client and tracks
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  
  // Start Agora session when modal opens
  useEffect(() => {
    if (isOpen && currentUser && !videoSession) {
      const session = startVideoSession(
        currentUser, 
        astrologer.id.toString(), 
        astrologer.name
      );
      
      if (session) {
        setVideoSession(session);
      }
    }
    
    return () => {
      if (inCall) {
        // Clean up the call when component unmounts
        client.leave();
        setInCall(false);
        if (tracks) {
          tracks[0].close();
          tracks[1].close();
        }
      }
    };
  }, [isOpen, currentUser, astrologer, client, tracks]);
  
  // Initialize client when ready
  useEffect(() => {
    if (ready && videoSession && !inCall) {
      const initCall = async () => {
        // Join the channel
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setCallStatus('connected');
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });
        
        try {
          await client.join(
            'your-agora-app-id', // Replace with your Agora app ID
            videoSession.channelName,
            videoSession.token || null,
            videoSession.uid || null
          );
          
          if (tracks) {
            await client.publish(tracks);
            setInCall(true);
            setCallStatus('connected');
            toast.success(`Connected with ${astrologer.name}`);
          }
        } catch (error) {
          console.error('Error joining Agora channel:', error);
          toast.error('Failed to connect video call');
        }
      };
      
      initCall();
    }
  }, [ready, videoSession, client, tracks]);
  
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
            handleEndCall();
            toast.error("Call ended due to low balance");
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
    if (inCall) {
      client.leave();
      tracks?.[0].close();
      tracks?.[1].close();
      setInCall(false);
    }
    
    setCallStatus('ended');
    toast.success(`Call duration: ${formatDuration(duration)}`);
    
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
      // Reset state for next call
      setCallStatus('connecting');
      setDuration(0);
      setVideoSession(null);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'connecting' ? 'Connecting...' : 
             callStatus === 'connected' ? 'Video Call' : 
             'Call Ended'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {callStatus === 'connected' ? 
              `Connected with ${astrologer.name} (₹${astrologer.price}/min)` : 
              callStatus === 'ended' ? 
              `Call with ${astrologer.name} ended` : 
              `Connecting to ${astrologer.name}...`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4 space-y-4">
          {callStatus === 'connecting' && !inCall && (
            <div className="w-16 h-16 border-4 border-ifind-aqua border-t-transparent rounded-full animate-spin"></div>
          )}
          
          {(callStatus === 'connected' || (ready && inCall)) && (
            <div className="w-full h-64 md:h-80">
              <VideoCall 
                client={client} 
                tracks={tracks} 
                setStart={setInCall} 
                channelName={videoSession?.channelName} 
              />
            </div>
          )}
          
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
          <Button 
            onClick={handleEndCall} 
            variant="destructive" 
            className="rounded-full p-3"
            title="End call"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
