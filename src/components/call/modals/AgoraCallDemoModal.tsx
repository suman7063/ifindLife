import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAgoraCallDemo } from '@/hooks/useAgoraCallDemo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SimpleCallTypeSelector from '@/components/chat/SimpleCallTypeSelector';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import VideoContainer from '../content/VideoContainer';
import { Card } from '@/components/ui/card';
import { Play, Eye, RotateCcw } from 'lucide-react';

interface AgoraCallDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgoraCallDemoModal: React.FC<AgoraCallDemoModalProps> = ({
  isOpen,
  onClose
}) => {
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended'>('choosing');
  const [callType, setCallType] = useState<'video' | 'voice'>('video');
  const [showChat, setShowChat] = useState(false);
  const [videoMode, setVideoMode] = useState<'side-by-side' | 'picture-in-picture'>('picture-in-picture');

  // Mock expert data for demo
  const mockExpert = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    imageUrl: '/placeholder.svg',
    price: 100
  };

  const {
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    isConnecting,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    formatTime
  } = useAgoraCallDemo(mockExpert.price);

  const handleStartCall = async (selectedDuration: number, selectedType: 'video' | 'voice') => {
    setCallType(selectedType);
    setCallStatus('connecting');
    
    const success = await startCall(selectedDuration, selectedType);
    if (success) {
      setCallStatus('connected');
    }
  };

  const handleEndCall = async () => {
    await endCall();
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleReset = () => {
    setCallStatus('choosing');
    setShowChat(false);
    if (callState) {
      endCall();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const renderContent = () => {
    if (callStatus === 'choosing') {
      return (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Demo Mode
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">Call Interface Preview</h3>
            <p className="text-muted-foreground text-sm">
              Experience how the call interface works without real payments or connections
            </p>
          </div>
          
          <SimpleCallTypeSelector
            expert={mockExpert}
            onStartCall={handleStartCall}
          />
        </div>
      );
    }

    if (callStatus === 'ended') {
      return (
        <div className="text-center space-y-4 py-8">
          <h3 className="text-lg font-semibold">Demo Call Completed</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Call Duration: {formatTime(duration)}</p>
            <p>Demo Cost: ₹{cost}</p>
          </div>
          <p className="text-sm text-muted-foreground">Modal will close automatically...</p>
        </div>
      );
    }

    if (callError) {
      return (
        <Card className="p-6 text-center space-y-4">
          <h3 className="text-lg font-semibold text-destructive">Demo Error</h3>
          <p className="text-sm text-muted-foreground">{callError}</p>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {callState && (
          <>
            <div className="space-y-4">
              <div className={`${showChat ? 'w-1/2' : 'w-full'} space-y-4`}>
                <VideoContainer 
                  callState={callState}
                  callStatus={callStatus}
                  userName="Demo User"
                  expertName={mockExpert.name}
                  isDemoMode={true}
                  videoMode={videoMode}
                />
                
                {callStatus === 'connected' && (
                  <div className="text-center space-y-2 p-4 bg-muted/20 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-mono font-semibold">{formatTime(duration)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-mono font-semibold text-primary">{formatTime(remainingTime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost</p>
                        <p className="font-semibold">₹{cost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rate</p>
                        <p className="font-semibold">₹{mockExpert.price}/min</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <AgoraCallControls
                callState={callState}
                callType={callType === 'voice' ? 'audio' : 'video'}
                isFullscreen={false}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
                onEndCall={handleEndCall}
                onToggleChat={() => setShowChat(!showChat)}
                onToggleVideoMode={() => setVideoMode(prev => prev === 'picture-in-picture' ? 'side-by-side' : 'picture-in-picture')}
                onToggleFullscreen={() => {}}
                showChat={showChat}
                videoMode={videoMode}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[${showChat && callStatus === 'connected' ? '900px' : '600px'}] max-h-[90vh] p-0 overflow-hidden flex flex-col`}>
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Agora Call Demo
            </DialogTitle>
            {callStatus !== 'choosing' && callStatus !== 'ended' && (
              <Button onClick={handleReset} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {renderContent()}
        </div>
        
        {isConnecting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Connecting to demo call...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgoraCallDemoModal;