/**
 * Call Interruption Modal
 * Shown when a call gets disconnected
 */

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

interface CallInterruptionModalProps {
  isOpen: boolean;
  onRejoin: () => void;
  onEndCall: () => void;
  isUser: boolean; // true for user, false for expert
}

const CallInterruptionModal: React.FC<CallInterruptionModalProps> = ({
  isOpen,
  onRejoin,
  onEndCall,
  isUser
}) => {
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Debug log
  React.useEffect(() => {
    if (isOpen) {
      console.log('🔔 CallInterruptionModal is now OPEN', { isOpen, isUser });
    }
  }, [isOpen, isUser]);

  const handleNoImDone = () => {
    if (isUser) {
      // Show double confirmation for users
      setShowEndConfirmation(true);
    } else {
      // Experts can end directly
      onEndCall();
    }
  };

  const handleConfirmEnd = () => {
    setShowEndConfirmation(false);
    setShowCompletionMessage(true);
    // Call onEndCall immediately to mark call as completed
    onEndCall();
  };

  const handleCloseCompletionMessage = () => {
    setShowCompletionMessage(false);
  };

  const handleRejoinFromConfirmation = () => {
    setShowEndConfirmation(false);
    onRejoin();
  };

  // Completion message dialog - shown independently of main modal
  // This ensures it stays visible even if parent closes the interruption modal
  if (showCompletionMessage) {
    return (
      <AlertDialog open={true} onOpenChange={handleCloseCompletionMessage}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Thank you for your time</AlertDialogTitle>
            <AlertDialogDescription>
              The call has been marked as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseCompletionMessage}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Double confirmation dialog
  if (showEndConfirmation) {
    return (
      <AlertDialog open={showEndConfirmation} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure, you want to end the call. This will mean that the call is completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRejoinFromConfirmation}>
              Rejoin the call
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEnd} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, I am done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Main interruption dialog
  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="sm:max-w-md z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Your call was interrupted</AlertDialogTitle>
          <AlertDialogDescription>
            It looks like the call got disconnected. Would you like to rejoin and continue your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {isUser && (
            <Button
              variant="outline"
              onClick={handleNoImDone}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              No, I'm Done
            </Button>
          )}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔄 Rejoin button clicked');
              onRejoin();
            }}
            className="w-full sm:w-auto"
            type="button"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Yes, Rejoin Call
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CallInterruptionModal;

