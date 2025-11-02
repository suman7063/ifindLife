/**
 * Incoming Call Dialog
 * Shows a modal popup when an expert receives an incoming call request
 */

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, PhoneOff, Video, Mic, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CallRequest {
  id: string;
  user_id: string;
  expert_id?: string;
  call_type: 'audio' | 'video';
  status: string;
  created_at: string;
  expires_at: string;
  user_metadata?: {
    name?: string;
    avatar?: string;
  };
  estimated_cost_inr?: number;
  estimated_cost_eur?: number;
  channel_name?: string;
  agora_token?: string | null;
  agora_uid?: number | null;
  call_session_id?: string | null;
}

interface IncomingCallDialogProps {
  callRequest: CallRequest | null;
  isOpen: boolean;
  onAccept: (callRequestId: string) => Promise<void>;
  onDecline: (callRequestId: string) => Promise<void>;
  onClose?: () => void;
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  callRequest,
  isOpen,
  onAccept,
  onDecline,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Calculate time remaining until call expires
  useEffect(() => {
    if (!callRequest?.expires_at) return;

    const updateTimeRemaining = () => {
      const expiresAt = new Date(callRequest.expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [callRequest?.expires_at]);

  // Auto-close if call expires
  useEffect(() => {
    if (timeRemaining === 0 && isOpen) {
      toast.info('Call request expired');
      onClose?.();
    }
  }, [timeRemaining, isOpen, onClose]);

  const handleAccept = async () => {
    if (!callRequest || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onAccept(callRequest.id);
      // Don't close dialog immediately - let parent component handle it
      // The dialog will close when onClose is called or incomingCall is cleared
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!callRequest || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onDecline(callRequest.id);
      toast.info('Call declined');
      onClose?.();
    } catch (error) {
      console.error('Error declining call:', error);
      toast.error('Failed to decline call');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!callRequest) return null;

  const userName = callRequest.user_metadata?.name || 'A user';
  const userAvatar = callRequest.user_metadata?.avatar;
  const callType = callRequest.call_type === 'video' ? 'Video' : 'Audio';
  const estimatedCost = callRequest.estimated_cost_inr || callRequest.estimated_cost_eur || 0;
  const currency = callRequest.estimated_cost_inr ? 'INR' : 'EUR';
  const currencySymbol = currency === 'INR' ? '₹' : '€';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose?.()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">📞 Incoming Call</DialogTitle>
          <DialogDescription className="text-center">
            {callType} call request
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          {/* User Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-green-500 ring-offset-2">
              <AvatarImage src={userAvatar || undefined} alt={userName} />
              <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              {callType === 'video' ? (
                <Video className="h-4 w-4 text-white" />
              ) : (
                <Mic className="h-4 w-4 text-white" />
              )}
            </div>
          </div>

          {/* User Name */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{userName}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Wants to have a {callType.toLowerCase()} call with you
            </p>
          </div>

          {/* Call Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
            </Badge>
            {estimatedCost > 0 && (
              <Badge variant="outline">
                {currencySymbol}{estimatedCost.toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={handleDecline}
              disabled={isProcessing}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button
              variant="default"
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
              disabled={isProcessing}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              {isProcessing ? 'Accepting...' : 'Accept'}
            </Button>
          </div>

          {isProcessing && (
            <p className="text-xs text-gray-500">Processing...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallDialog;

