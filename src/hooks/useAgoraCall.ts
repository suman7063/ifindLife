
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';

interface AgoraCallHookReturn {
  isInCall: boolean;
  isConnecting: boolean;
  startCall: (expertId: string) => Promise<void>;
  endCall: () => void;
}

export const useAgoraCall = (): AgoraCallHookReturn => {
  const { isAuthenticated, user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const startCall = useCallback(async (expertId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to start a call');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('Starting call with expert:', expertId);
      
      // Simulate call initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsInCall(true);
      toast.success('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, user]);

  const endCall = useCallback(() => {
    setIsInCall(false);
    setIsConnecting(false);
    console.log('Call ended');
    toast.info('Call ended');
  }, []);

  return {
    isInCall,
    isConnecting,
    startCall,
    endCall
  };
};
