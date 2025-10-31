import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CallPreSelection } from './CallPreSelection';
import { CallInProgress } from './CallInProgress';
import { CallEnded } from './CallEnded';
import { CallError } from './CallError';
import { useCallInterface } from './hooks/useCallInterface';
import CallAuthMessage from '../call/modals/CallAuthMessage';

export type CallState = 'selecting' | 'connecting' | 'connected' | 'ended' | 'error';
export type CallType = 'video' | 'audio';
export type CallDuration = 30 | 60;

export interface Expert {
  id: string;
  name: string;
  imageUrl: string;
  pricePerMinute: number;
}

interface CallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  isOpen,
  onClose,
  expert
}) => {
  const {
    callState,
    callType,
    duration,
    sessionData,
    error,
    isAuthenticated,
    handleStartCall,
    handleEndCall,
    retryCall
  } = useCallInterface(expert);

  const handleClose = () => {
    if (callState === 'connected' || callState === 'connecting') {
      // Don't allow closing during active call
      return;
    }
    onClose();
  };

  const renderContent = () => {
    // Show authentication message if not authenticated
    if (!isAuthenticated) {
      return (
        <CallAuthMessage
          expertName={expert.name}
          onClose={onClose}
        />
      );
    }

    switch (callState) {
      case 'selecting':
        return (
          <CallPreSelection
            expert={expert}
            onStartCall={handleStartCall}
          />
        );
      
      case 'connecting':
      case 'connected':
        return (
          <CallInProgress
            expert={expert}
            callState={callState}
            callType={callType!}
            duration={duration!}
            sessionData={sessionData}
            onEndCall={handleEndCall}
          />
        );
      
      case 'ended':
        return (
          <CallEnded
            expert={expert}
            sessionData={sessionData}
            onClose={onClose}
          />
        );
      
      case 'error':
        return (
          <CallError
            error={error}
            onRetry={retryCall}
            onClose={onClose}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 overflow-hidden border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Call with {expert.name}</DialogTitle>
          <DialogDescription>Video or audio call interface</DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};