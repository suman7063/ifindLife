
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ChatStatus, ChatType } from './useChatModalState';

interface ChatInitializationProps {
  expertId: number;
  expertName: string;
  setChatType: (type: ChatType) => void;
  setChatStatus: (status: ChatStatus) => void;
  setErrorMessage: (message: string | null) => void;
  initializeCall: (options: { expertId: string; expertName: string; chatMode: boolean }) => Promise<any>;
  startCall: (type: 'audio' | 'video') => Promise<boolean>;
  startTimer: () => void;
}

export const useChatInitialization = ({
  expertId,
  expertName,
  setChatType,
  setChatStatus,
  setErrorMessage,
  initializeCall,
  startCall,
  startTimer
}: ChatInitializationProps) => {
  
  const handleStartChat = useCallback(async (selectedType: ChatType) => {
    try {
      setChatType(selectedType);
      setChatStatus('connecting');
      
      // Initialize the call/chat infrastructure
      await initializeCall({
        expertId: expertId.toString(),
        expertName: expertName,
        chatMode: true
      });
      
      // Start a call of appropriate type
      const success = await startCall(selectedType === 'video' ? 'video' : 'audio');
      
      if (success) {
        setChatStatus('connected');
        startTimer();
      } else {
        setErrorMessage('Failed to initialize chat session. Please try again.');
        setChatStatus('error');
      }
      
    } catch (error: any) {
      console.error('Failed to start chat:', error);
      setErrorMessage('Failed to initialize chat session. Please try again.');
      setChatStatus('error');
    }
  }, [expertId, expertName, setChatType, setChatStatus, setErrorMessage, initializeCall, startCall, startTimer]);

  const handleEndChat = useCallback(async (finishCall: () => Promise<{success: boolean, duration: number, cost: number}>) => {
    try {
      const result = await finishCall();
      
      if (result.success) {
        setChatStatus('ended');
        toast.success(`Chat ended successfully. ${result.cost > 0 ? `Total cost: ₹${result.cost.toFixed(2)}` : ''}`);
      } else {
        setErrorMessage('Failed to end chat properly. Please refresh the page.');
        setChatStatus('error');
      }
      
      // Return true to indicate successful completion
      return true;
      
    } catch (error) {
      console.error('Error ending chat:', error);
      setErrorMessage('Failed to end chat properly. Please refresh the page.');
      setChatStatus('error');
      
      // Return false to indicate failure
      return false;
    }
  }, [setChatStatus, setErrorMessage]);

  return {
    handleStartChat,
    handleEndChat
  };
};
