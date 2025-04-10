
import { useState, useCallback } from 'react';
import { CallState } from '@/lib/agoraService';

export const useCallOperations = (
  expertId: number, 
  setCallState: (state: React.SetStateAction<CallState>) => void,
  callState: CallState,
  startTimers: (initialDuration: number, ratePerMinute: number) => void,
  stopTimers: () => void,
  calculateFinalCost: () => number
) => {
  const startCall = useCallback(async (type: 'audio' | 'video'): Promise<boolean> => {
    try {
      // Simulate connecting to a call
      setCallState(prev => ({ 
        ...prev, 
        isConnecting: true,
        hasError: false
      }));
      
      // Simulate a delay for connecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set connected state
      setCallState(prev => ({ 
        ...prev, 
        isConnecting: false,
        isConnected: true,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: type === 'video'
      }));
      
      // Start timers with 15 minutes initial duration
      startTimers(15, 1);
      
      return true;
    } catch (error) {
      setCallState(prev => ({
        ...prev,
        isConnecting: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      return false;
    }
  }, [setCallState, startTimers]);

  const endCall = useCallback(async (): Promise<{success: boolean, cost: number}> => {
    try {
      // Stop timers first
      stopTimers();
      
      // Reset call state
      setCallState(prev => ({
        ...prev,
        isConnected: false,
        isJoined: false
      }));
      
      const finalCost = calculateFinalCost();
      
      return { 
        success: true, 
        cost: finalCost 
      };
    } catch (error) {
      return { 
        success: false, 
        cost: 0 
      };
    }
  }, [setCallState, stopTimers, calculateFinalCost]);

  const handleToggleMute = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  }, [setCallState]);

  const handleToggleVideo = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  }, [setCallState]);

  return {
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo
  };
};
