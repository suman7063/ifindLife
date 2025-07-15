import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealAgoraCall } from '@/hooks/useRealAgoraCall';
import { Badge } from '@/components/ui/badge';
import { Video, Phone, PhoneOff } from 'lucide-react';

// Test expert data
const testExpert = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  price: 50 // 50 INR per minute
};

const TestCallFlow: React.FC = () => {
  const [callType, setCallType] = useState<'video' | 'voice'>('video');
  const [duration, setDuration] = useState(30); // 30 minutes default
  
  const {
    callState,
    duration: callDuration,
    cost,
    remainingTime,
    callError,
    isConnecting,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    formatTime
  } = useRealAgoraCall(testExpert.id, testExpert.price);

  const handleStartCall = async () => {
    console.log('🚀 Testing complete call flow...');
    await startCall(duration, callType);
  };

  const handleEndCall = async () => {
    await endCall();
  };

  const formatCurrency = (amount: number) => `₹${amount}`;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Test Complete Call + Payment Flow
          {callState?.isJoined && (
            <Badge variant="success">Call Active</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!callState?.isJoined ? (
          <>
            {/* Call Configuration */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Expert: {testExpert.name}</label>
                <p className="text-xs text-muted-foreground">
                  Rate: {formatCurrency(testExpert.price)}/minute
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Call Type:</label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={callType === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCallType('video')}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button
                    variant={callType === 'voice' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCallType('voice')}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Voice
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Duration (minutes):</label>
                <div className="flex gap-2 mt-1">
                  {[15, 30, 60].map(mins => (
                    <Button
                      key={mins}
                      variant={duration === mins ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDuration(mins)}
                    >
                      {mins}m
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total cost: {formatCurrency(duration * testExpert.price)}
                </p>
              </div>
            </div>

            {callError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{callError}</p>
              </div>
            )}

            <Button 
              onClick={handleStartCall}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? 'Starting...' : `Start ${callType} Call (${formatCurrency(duration * testExpert.price)})`}
            </Button>
          </>
        ) : (
          <>
            {/* Active Call UI */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Call with {testExpert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {callType === 'video' ? 'Video Call' : 'Voice Call'} Active
                </p>
              </div>

              {/* Call Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-mono">{formatTime(callDuration)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="font-mono">{formatTime(remainingTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-semibold">{formatCurrency(cost)}</p>
                </div>
              </div>

              {/* Video Display Area */}
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-white text-sm">
                  {callState.isVideoEnabled ? '📹 Video Active' : '🎤 Audio Only'}
                </p>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center gap-3">
                <Button
                  variant={callState.isMuted ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={handleToggleMute}
                >
                  {callState.isMuted ? '🔇' : '🎤'}
                </Button>
                
                {callType === 'video' && (
                  <Button
                    variant={callState.isVideoEnabled ? 'outline' : 'destructive'}
                    size="sm"
                    onClick={handleToggleVideo}
                  >
                    {callState.isVideoEnabled ? '📹' : '📹'} 
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Testing Flow:</strong> This will create a real Razorpay payment order, 
            open payment modal, verify payment, and start an Agora video call session.
            {!callState?.isJoined && ' Click "Start Call" to test the complete flow.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCallFlow;