import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  User, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { IncomingCallRequest } from '@/hooks/useIncomingCallManager';

interface IncomingCallModalProps {
  call: IncomingCallRequest | null;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  isOpen,
  onAccept,
  onDecline
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Calculate time remaining
  useEffect(() => {
    if (!call) return;

    const updateTimer = () => {
      const now = new Date();
      const expires = new Date(call.expires_at);
      const remaining = Math.max(0, expires.getTime() - now.getTime());
      setTimeRemaining(Math.floor(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [call]);

  if (!call) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userDisplayName = call.user_metadata?.name || 'Anonymous User';
  const userAvatar = call.user_metadata?.avatar || null;
  const estimatedCost = call.estimated_cost_inr || call.estimated_cost_usd || 0;
  const currency = call.estimated_cost_inr ? 'INR' : 'EUR';
  const currencySymbol = currency === 'INR' ? '₹' : '€';

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Incoming {call.call_type === 'video' ? 'Video' : 'Audio'} Call
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* User Avatar and Info */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userAvatar} alt={userDisplayName} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{userDisplayName}</h3>
              <Badge variant={call.call_type === 'video' ? 'default' : 'secondary'}>
                {call.call_type === 'video' ? (
                  <><Video className="w-3 h-3 mr-1" /> Video Call</>
                ) : (
                  <><Phone className="w-3 h-3 mr-1" /> Audio Call</>
                )}
              </Badge>
            </div>
          </div>

          {/* Call Details */}
          <div className="w-full space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time remaining:</span>
              </div>
              <Badge variant={timeRemaining < 30 ? 'destructive' : 'outline'}>
                {formatTime(timeRemaining)}
              </Badge>
            </div>
            
            {estimatedCost > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Estimated cost:</span>
                </div>
                <span className="font-medium">
                  ${estimatedCost.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 w-full">
            <Button
              variant="destructive"
              size="lg"
              onClick={onDecline}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Decline</span>
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={onAccept}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-5 h-5" />
              <span>Accept</span>
            </Button>
          </div>

          {/* Warning for low time */}
          {timeRemaining < 30 && (
            <div className="text-xs text-destructive text-center">
              Call will expire soon! Accept or decline quickly.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallModal;