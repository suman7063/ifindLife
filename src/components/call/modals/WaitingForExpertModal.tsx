/**
 * Waiting For Expert Modal
 * Shows while waiting for expert to accept the call
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserCheck, Clock, Sparkles, Radio } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md border-0 shadow-2xl overflow-hidden p-0">
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse [animation-delay:2000ms] transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative p-8">
            <DialogHeader className="text-center space-y-3 mb-6">
              <div className="flex justify-center mb-4">
                {/* Animated User Check Icon with Ripple Effect */}
                <div className="relative">
                  {/* Outer Ripple Rings */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-primary/30 rounded-full animate-ping [animation-delay:500ms]"></div>
                  <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
                  
                  {/* Main Icon Container */}
                  <div className="relative bg-gradient-to-br from-primary to-primary/80 p-5 rounded-full shadow-lg">
                    <UserCheck className="h-10 w-10 text-white" />
                  </div>
                  
                  {/* Small Radio Icon Indicator */}
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md animate-pulse">
                    <Radio className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Waiting for {expertName}
              </DialogTitle>
              
              <DialogDescription className="text-base font-medium text-foreground/80">
                Your call request has been sent. Waiting for expert to accept...
              </DialogDescription>
            </DialogHeader>

            {/* Animated Loading Indicator */}
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              {/* Rotating Clock Icon */}
              <div className="relative">
                <div className="bg-primary/10 rounded-full p-4 animate-spin [animation-duration:3s]">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Pulsing Dots with Different Timing */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              </div>

              {/* Status Text */}
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Please wait while we connect you with <span className="font-semibold text-primary">{expertName}</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>Expert will join shortly...</span>
                </div>
              </div>
            </div>

            {/* Animated Status Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-primary">Request Pending</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingForExpertModal;

