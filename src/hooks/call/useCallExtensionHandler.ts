
import { useCallModal } from '@/components/call/modals/context/CallModalProvider';
import { toast } from 'sonner';

export const useCallExtensionHandler = () => {
  const {
    userProfile,
    timerData
  } = useCallModal();

  const handleExtendCall = async (extensionMinutes: number, cost: number): Promise<boolean> => {
    try {
      const currency = userProfile?.currency as 'USD' | 'INR' || 'USD';
      // TODO: Process payment for extension via gateway
      // For now, we'll directly extend the call
      const extensionSuccess = await timerData.extendCall(extensionMinutes);
      
      if (extensionSuccess) {
        toast.success(`Call extended by ${extensionMinutes} minutes`);
        return true;
      } else {
        toast.error('Failed to extend call');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Extension failed:', error);
      toast.error('Failed to extend call');
      return false;
    }
  };

  return { handleExtendCall };
};
