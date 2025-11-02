/**
 * Waiting For Expert Modal
 * Shows while waiting for expert to accept the call
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface WaitingForExpertModalProps {
  isOpen: boolean;
  expertName: string;
}

const WaitingForExpertModal: React.FC<WaitingForExpertModalProps> = ({
  isOpen,
  expertName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Waiting for {expertName}</DialogTitle>
          <DialogDescription>
            Your call request has been sent. Waiting for expert to accept...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Please wait while we connect you with {expertName}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingForExpertModal;

