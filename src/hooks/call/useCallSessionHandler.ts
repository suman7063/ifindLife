
import { useCallModal } from '@/components/call/modals/context/CallModalProvider';
import { toast } from 'sonner';

interface UseCallSessionHandlerProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

export const useCallSessionHandler = ({ expert }: UseCallSessionHandlerProps) => {
  const {
    setCurrentSessionId,
    setCallStatus,
    setErrorMessage,
    currentSession,
    initializeCall,
    callOperations,
    timerData
  } = useCallModal();

  const handleCallStarted = async (sessionId: string, callType: 'audio' | 'video') => {
    try {
      setCurrentSessionId(sessionId);
      setCallStatus('connecting');
      
      // Get session details to extract duration
      if (currentSession) {
        timerData.setSelectedDurationMinutes(currentSession.selected_duration);
      }

      // Initialize the call infrastructure
      await initializeCall({
        expertId: expert.id.toString(),
        expertName: expert.name,
        chatMode: false
      });
      
      // Start the actual call
      const success = await callOperations.startCall(callType);
      
      if (success) {
        setCallStatus('connected');
        toast.success(`${callType} call connected successfully`);
      } else {
        throw new Error('Failed to connect call');
      }
      
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setErrorMessage('Failed to initialize call. Please try again.');
      setCallStatus('error');
    }
  };

  return { handleCallStarted };
};
