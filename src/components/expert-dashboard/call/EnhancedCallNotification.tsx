import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneOff, Video, VideoOff, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallFlow } from '@/hooks/useCallFlow';

interface IncomingCallRequest {
  id: string;
  user_id: string;
  call_type: 'audio' | 'video';
  channel_name: string;
  agora_token: string | null;
  agora_uid: number | null;
  user_metadata: any;
  created_at: string;
  expires_at: string;
}

interface EnhancedCallNotificationProps {
  callRequest: IncomingCallRequest;
  onAccept?: (callRequestId: string) => void;
  onDecline?: (callRequestId: string) => void;
  onDismiss?: () => void;
}

const EnhancedCallNotification: React.FC<EnhancedCallNotificationProps> = ({
  callRequest,
  onAccept,
  onDecline,
  onDismiss
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // seconds
  const [userInfo, setUserInfo] = useState<any>(null);

  // Fetch user info
  useEffect(() => {
    if (callRequest.user_id) {
      supabase
        .from('users')
        .select('name, profile_picture')
        .eq('id', callRequest.user_id)
        .single()
        .then(({ data }) => {
          if (data) {
            setUserInfo(data);
          } else {
            // Use metadata if available
            setUserInfo({
              name: callRequest.user_metadata?.name || 'User',
              profile_picture: callRequest.user_metadata?.avatar || null
            });
          }
        });
    }
  }, [callRequest.user_id, callRequest.user_metadata]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(callRequest.expires_at);
      const remaining = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        onDismiss?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callRequest.expires_at, onDismiss]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userName = userInfo?.name || callRequest.user_metadata?.name || 'User';
  const userAvatar = userInfo?.profile_picture || callRequest.user_metadata?.avatar || null;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary animate-in slide-in-from-top-5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {callRequest.call_type === 'video' ? (
                <Video className="w-5 h-5 text-primary" />
              ) : (
                <Phone className="w-5 h-5 text-primary" />
              )}
              <h3 className="font-semibold text-lg">
                Incoming {callRequest.call_type === 'video' ? 'Video' : 'Audio'} Call
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-lg">{userName}</p>
              <p className="text-sm text-muted-foreground">
                Wants to connect with you
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 p-2 bg-muted rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatTime(timeRemaining)} remaining
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onDecline?.(callRequest.id);
                toast.success('Call declined');
              }}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={async () => {
                if (onAccept) {
                  onAccept(callRequest.id);
                } else {
                  // Default accept handler
                  const { acceptCall } = await import('@/services/callService');
                  await acceptCall(callRequest.id);
                }
                toast.success('Call accepted! Connecting...');
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCallNotification;

