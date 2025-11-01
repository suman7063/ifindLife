import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff,
  Mic,
  MicOff,
  Clock,
  X
} from 'lucide-react';
import { useCallFlow } from '@/hooks/useCallFlow';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

interface UserCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertAuthId: string;
  expertName: string;
  expertAvatar?: string;
  expertPrice?: number;
}

const UserCallInterface: React.FC<UserCallInterfaceProps> = ({
  isOpen,
  onClose,
  expertId,
  expertAuthId,
  expertName,
  expertAvatar,
  expertPrice = 30
}) => {
  const { user } = useSimpleAuth();
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [selectedDuration, setSelectedDuration] = useState(15); // minutes
  const [isWaiting, setIsWaiting] = useState(false);

  const {
    isConnecting,
    isInCall,
    callState,
    duration,
    channelName,
    startCall,
    stopCall,
    toggleMute,
    toggleVideo,
    localVideoRef,
    remoteVideoRef
  } = useCallFlow({
    onCallStarted: () => {
      setIsWaiting(false);
      toast.success('Call started!');
    },
    onCallEnded: () => {
      setIsWaiting(false);
      onClose();
    }
  });

  const handleStartCall = async () => {
    setIsWaiting(true);
    const estimatedCost = (selectedDuration * expertPrice) / 60; // Per minute
    
    const success = await startCall(
      callType,
      selectedDuration,
      expertId,
      expertAuthId,
      estimatedCost,
      'INR'
    );

    if (!success) {
      setIsWaiting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedCost = (selectedDuration * expertPrice) / 60;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Call with {expertName}</span>
            {!isInCall && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {!isInCall && !isConnecting && !isWaiting && 'Select call type and duration to start'}
            {isWaiting && 'Waiting for expert to accept your call request'}
            {isConnecting && 'Establishing connection with the expert'}
            {isInCall && `Connected - Duration: ${formatTime(duration)}`}
          </DialogDescription>
        </DialogHeader>

        {!isConnecting && !isInCall && !isWaiting && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              {/* Call Type Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Call Type</label>
                <div className="flex gap-4">
                  <Button
                    variant={callType === 'video' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setCallType('video')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant={callType === 'audio' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setCallType('audio')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Audio Call
                  </Button>
                </div>
              </div>

              {/* Duration Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((mins) => (
                    <Button
                      key={mins}
                      variant={selectedDuration === mins ? 'default' : 'outline'}
                      onClick={() => setSelectedDuration(mins)}
                    >
                      {mins} min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Cost</span>
                  <span className="text-lg font-semibold">₹{estimatedCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Start Call Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleStartCall}
                disabled={isConnecting}
              >
                <Phone className="w-4 h-4 mr-2" />
                Start {callType === 'video' ? 'Video' : 'Audio'} Call
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Waiting for Expert */}
        {isWaiting && (
          <Card className="mt-4">
            <CardContent className="pt-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Waiting for Expert...</h3>
              <p className="text-sm text-muted-foreground">
                Your call request has been sent. Waiting for {expertName} to accept.
              </p>
            </CardContent>
          </Card>
        )}

        {/* In Call Interface */}
        {isInCall && callState && (
          <div className="mt-4 space-y-4">
            {/* Call Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={expertAvatar} />
                  <AvatarFallback>{expertName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{expertName}</p>
                  <p className="text-sm text-muted-foreground">
                    {callType === 'video' ? 'Video Call' : 'Audio Call'}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(duration)}
              </Badge>
            </div>

            {/* Video Display */}
            {callType === 'video' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local Video */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <div ref={localVideoRef} className="w-full h-full" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    You
                  </div>
                  {!callState.isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Remote Video */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <div ref={remoteVideoRef} className="w-full h-full" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {expertName}
                  </div>
                  {callState.remoteUsers.length === 0 && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Waiting for expert...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audio Only Display */}
            {callType === 'audio' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={expertAvatar} />
                      <AvatarFallback className="text-2xl">{expertName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-lg font-semibold">{expertName}</p>
                      <p className="text-sm text-muted-foreground">
                        {callState.remoteUsers.length > 0 ? 'Connected' : 'Connecting...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={callState.isMuted ? 'destructive' : 'outline'}
                size="lg"
                onClick={toggleMute}
              >
                {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {callType === 'video' && (
                <Button
                  variant={callState.isVideoEnabled ? 'outline' : 'destructive'}
                  size="lg"
                  onClick={toggleVideo}
                >
                  {callState.isVideoEnabled ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </Button>
              )}

              <Button
                variant="destructive"
                size="lg"
                onClick={stopCall}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        )}

        {/* Connecting State */}
        {isConnecting && !isWaiting && (
          <Card className="mt-4">
            <CardContent className="pt-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Connecting...</h3>
              <p className="text-sm text-muted-foreground">Setting up your call...</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserCallInterface;

