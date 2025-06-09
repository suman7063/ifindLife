
import React from 'react';
import { toast } from 'sonner';
import { useCallModal } from '../context/CallModalProvider';

interface CallEndHandlerProps {
  onClose: () => void;
}

export const CallEndHandler: React.FC<CallEndHandlerProps> = ({ onClose }) => {
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

export default CallEndHandler;
