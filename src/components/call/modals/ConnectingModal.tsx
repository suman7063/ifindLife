/**
 * Connecting Modal
 * Shows connecting confirmation after user clicks Start Call
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Phone, Sparkles } from 'lucide-react';

interface ConnectingModalProps {
  isOpen: boolean;
  expertName: string;
}

const ConnectingModal: React.FC<ConnectingModalProps> = ({
  isOpen,
  expertName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl overflow-hidden p-0">
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative p-8">
            <DialogHeader className="text-center space-y-3 mb-6">
              <div className="flex justify-center mb-4">
                {/* Animated Phone Icon with Pulse Effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-primary/30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-full shadow-lg">
                    <Phone className="h-8 w-8 text-white animate-bounce" />
                  </div>
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Connecting...
              </DialogTitle>
              
              <DialogDescription className="text-base font-medium text-foreground/80">
                Initiating call with <span className="font-semibold text-primary">{expertName}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Animated Loading Indicator */}
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              {/* Pulsing Dots */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              </div>

              {/* Status Text */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Please wait while we set up your call
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>Preparing connection...</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectingModal;

