
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import AgoraCallControls from './call/AgoraCallControls';
import AgoraCallTypeSelector from './call/AgoraCallTypeSelector';
import AgoraCallContent from './call/AgoraCallContent';
import { useUserAuth } from '@/hooks/useUserAuth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import RechargeDialog from './user/dashboard/RechargeDialog';

interface AgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ isOpen, onClose, expert }) => {
  const { currentUser, user } = useUserAuth();
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const {
    callState,
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  } = useAgoraCall(expert.id, expert.price);
  
  // Determine if the user is authenticated
  const isAuthenticated = !!user;
  
  // Reset status when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('choosing');
      setShowChat(false);
      setIsFullscreen(false);
    }
  }, [isOpen]);
  
  // Handle errors
  useEffect(() => {
    if (callError) {
      setCallStatus('error');
      toast.error('Call Error', {
        description: callError
      });
    }
  }, [callError]);
  
  // Handle fullscreen toggle
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);
  
  // Check if user has enough wallet balance (at least 15 minutes of call)
  const hasEnoughBalance = () => {
    if (!currentUser || typeof currentUser.walletBalance !== 'number') return false;
    
    // Calculate minimum required balance (15 minutes of call time)
    const minimumRequiredBalance = expert.price * 15;
    return currentUser.walletBalance >= minimumRequiredBalance;
  };
  
  // Initiate call
  const handleInitiateCall = async (selectedCallType: 'audio' | 'video') => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Authentication Required', {
        description: 'You need to log in or sign up to start a call with an expert.',
        action: {
          label: 'Log In',
          onClick: () => navigate('/user-login')
        }
      });
      return;
    }
    
    // Check if user has enough balance
    if (!hasEnoughBalance()) {
      toast.error('Insufficient Wallet Balance', {
        description: `You need at least ${currentUser?.currency || 'USD'} ${(expert.price * 15).toFixed(2)} in your wallet for a 15-minute call.`,
        action: {
          label: 'Recharge',
          onClick: () => setIsRechargeDialogOpen(true)
        }
      });
      return;
    }
    
    setCallStatus('connecting');
    console.log("Initiating call of type:", selectedCallType);
    
    const success = await startCall(selectedCallType);
    console.log("Call initiation result:", success);
    
    if (success) {
      setCallStatus('connected');
      toast.success(`${selectedCallType.charAt(0).toUpperCase() + selectedCallType.slice(1)} call connected`);
    } else {
      setCallStatus('error');
      toast.error('Failed to connect call', { 
        description: callError || 'Check your microphone and camera permissions' 
      });
    }
  };
  
  // End call
  const handleEndCall = async () => {
    const result = await endCall();
    
    if (result.success) {
      setCallStatus('ended');
      toast.success(`Call ended. Duration: ${formatTime(result.duration)}`);
      
      if (result.cost > 0) {
        toast.info(`Call cost: ${currentUser?.currency || 'USD'} ${result.cost.toFixed(2)}`);
      }
    } else {
      toast.error('Error ending call');
    }
  };
  
  // Toggle chat
  const handleToggleChat = () => {
    setShowChat(prev => !prev);
  };
  
  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      setIsFullscreen(false);
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => console.error("Error entering fullscreen:", err));
      setIsFullscreen(true);
    }
  };
  
  // Reset the call state
  const handleRetry = () => {
    setCallStatus('choosing');
  };

  // Handle successful wallet recharge
  const handleRechargeSuccess = () => {
    setIsRechargeDialogOpen(false);
    toast.success('Wallet recharged successfully! You can now start the call.');
  };
  
  // Handle recharge cancellation
  const handleRechargeCancel = () => {
    setIsRechargeDialogOpen(false);
  };

  // Render authentication message
  const renderAuthMessage = () => {
    return (
      <div className="flex flex-col items-center space-y-4 py-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to log in or sign up to start a call with {expert.name}.
          </AlertDescription>
        </Alert>
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/user-login')}
            className="bg-ifind-aqua hover:bg-ifind-teal"
          >
            Log In / Sign Up
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open && callStatus === 'connected') {
            // Confirm before closing if call is in progress
            if (window.confirm('Are you sure you want to end the call?')) {
              handleEndCall();
              onClose();
            }
          } else if (!open) {
            onClose();
          }
        }}
      >
        <DialogContent 
          ref={containerRef} 
          className={`${isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'sm:max-w-[600px]'} ${showChat && callStatus === 'connected' ? 'sm:max-w-[900px]' : ''}`}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {callStatus === 'choosing' ? 'Choose Call Type' : 
               callStatus === 'connecting' ? 'Connecting...' : 
               callStatus === 'connected' ? `Call with ${expert.name}` : 
               callStatus === 'error' ? 'Call Failed' :
               'Call Ended'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {callStatus === 'choosing' ? 
                `Connect with ${expert.name} via audio or video call` :
               callStatus === 'connecting' ? 
                `Connecting to ${expert.name}...` : 
               callStatus === 'connected' ? 
                `Connected with ${expert.name} (${currentUser?.currency || 'USD'} ${expert.price}/min)` : 
               callStatus === 'error' ?
                'There was a problem connecting your call' :
                `Call with ${expert.name} ended`}
            </DialogDescription>
          </DialogHeader>
          
          {!isAuthenticated && callStatus === 'choosing' ? (
            renderAuthMessage()
          ) : callStatus === 'choosing' ? (
            <AgoraCallTypeSelector 
              expert={expert}
              onSelectCallType={handleInitiateCall}
            />
          ) : callStatus === 'error' ? (
            <div className="flex flex-col items-center space-y-4 py-6">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {callError || 'Failed to connect the call. Please check your camera and microphone permissions.'}
                </AlertDescription>
              </Alert>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AgoraCallContent 
              callState={callState}
              callStatus={callStatus}
              showChat={showChat}
              duration={duration}
              remainingTime={remainingTime}
              cost={cost}
              formatTime={formatTime}
              expertPrice={expert.price}
              userName={currentUser?.name || 'You'}
              expertName={expert.name}
            />
          )}
          
          {callStatus !== 'choosing' && callStatus !== 'error' && (
            <DialogFooter className="flex justify-center space-x-4">
              <AgoraCallControls 
                callState={callState}
                callType={callType}
                isExtending={isExtending}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
                onEndCall={handleEndCall}
                onExtendCall={extendCall}
                onToggleChat={handleToggleChat}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <RechargeDialog 
        isOpen={isRechargeDialogOpen}
        onClose={handleRechargeCancel}
        onSuccess={handleRechargeSuccess}
        onCancel={handleRechargeCancel}
      />
    </>
  );
};

export default AgoraCallModal;
