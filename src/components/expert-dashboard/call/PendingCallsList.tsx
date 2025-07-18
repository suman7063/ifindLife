import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface PendingCallsListProps {
  calls: IncomingCallRequest[];
  isOpen: boolean;
  onClose: () => void;
  onAcceptCall: (callId: string) => void;
  onDeclineCall: (callId: string) => void;
}

const PendingCallsList: React.FC<PendingCallsListProps> = ({
  calls,
  isOpen,
  onClose,
  onAcceptCall,
  onDeclineCall
}) => {
  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const remaining = Math.max(0, expires.getTime() - now.getTime());
    const seconds = Math.floor(remaining / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemainingColor = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const remaining = Math.max(0, expires.getTime() - now.getTime());
    const seconds = Math.floor(remaining / 1000);
    
    if (seconds < 30) return 'text-destructive';
    if (seconds < 60) return 'text-orange-500';
    return 'text-muted-foreground';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pending Calls ({calls.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {calls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending calls</p>
            </div>
          ) : (
            calls.map((call) => {
              const userDisplayName = call.user_metadata?.name || 'Anonymous User';
              const userAvatar = call.user_metadata?.avatar || null;
              const estimatedCost = call.estimated_cost_usd || call.estimated_cost_inr || 0;

              return (
                <div
                  key={call.id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={userAvatar} alt={userDisplayName} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{userDisplayName}</h4>
                        <Badge variant={call.call_type === 'video' ? 'default' : 'secondary'}>
                          {call.call_type === 'video' ? (
                            <><Video className="w-3 h-3 mr-1" /> Video</>
                          ) : (
                            <><Phone className="w-3 h-3 mr-1" /> Audio</>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span className={getTimeRemainingColor(call.expires_at)}>
                            {formatTimeRemaining(call.expires_at)}
                          </span>
                        </div>

                        {estimatedCost > 0 && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${estimatedCost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeclineCall(call.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAcceptCall(call.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingCallsList;