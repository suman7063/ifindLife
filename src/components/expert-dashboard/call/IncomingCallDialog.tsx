import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Video } from 'lucide-react';
import type { IncomingCallRequest } from '@/hooks/call/useIncomingCalls';

interface IncomingCallDialogProps {
  request: IncomingCallRequest | null;
  onAccept: (req: IncomingCallRequest) => void;
  onDecline: (req: IncomingCallRequest) => void;
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({ request, onAccept, onDecline }) => {
  if (!request) return null;

  const isVideo = request.call_type === 'video';

  return (
    <Dialog open={!!request} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isVideo ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            Incoming {request.call_type} call
          </DialogTitle>
          <DialogDescription>
            A user wants to connect with you. You can accept or decline this call request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Channel: {request.channel_name}</p>
          <p className="text-xs text-muted-foreground">Request expires at {new Date(request.expires_at).toLocaleTimeString()}</p>
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onDecline(request)}>
            <PhoneOff className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button onClick={() => onAccept(request)}>
            <Phone className="h-4 w-4 mr-2" />
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallDialog;


