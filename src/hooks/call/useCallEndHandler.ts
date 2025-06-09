
import { useCallModal } from '@/components/call/modals/context/CallModalProvider';
import { toast } from 'sonner';

interface UseCallEndHandlerProps {
  onClose: () => void;
}

export const useCallEndHandler = ({ onClose }: UseCallEndHandlerProps) => {
  const {
    currentSessionId,
    endCallSession,
    setCallStatus,
    setErrorMessage,
    callOperations,
    timerData
  } = useCallModal();

  const handleEndCall = async () => {
    try {
      const result = await callOperations.endCall();
      
      if (result.success && currentSessionId) {
        await endCallSession(currentSessionId, timerData.duration, result.cost || 0);
        
        setCallStatus('ended');
        const timerStatus = timerData.getTimerStatus();
        const statusMessage = timerStatus === 'overtime' ? ' (overtime charges applied)' : '';
        
        toast.success(`Call ended. Duration: ${timerData.formatTime(timerData.duration)}${result.cost > 0 ? `, Cost: ${timerData.formatPrice(result.cost)}${statusMessage}` : ''}`);
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setErrorMessage('Failed to end call properly. Please refresh the page.');
        setCallStatus('error');
      }
      
    } catch (error) {
      console.error('Error ending call:', error);
      setErrorMessage('Failed to end call properly. Please refresh the page.');
      setCallStatus('error');
    }
  };

  return { handleEndCall };
};
