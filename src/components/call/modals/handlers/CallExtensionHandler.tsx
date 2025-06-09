
import React from 'react';
import { toast } from 'sonner';
import { useCallModal } from '../context/CallModalProvider';

export const CallExtensionHandler: React.FC = () => {
  const {
    userProfile,
    processWalletPayment,
    timerData
  } = useCallModal();

  const handleExtendCall = async (extensionMinutes: number, cost: number): Promise<boolean> => {
    try {
      const currency = userProfile?.currency as 'USD' | 'INR' || 'USD';
      
      // Process payment for extension
      const paymentSuccess = await processWalletPayment(cost, currency);
      
      if (paymentSuccess) {
        // Extend the call timer
        const extensionSuccess = await timerData.extendCall(extensionMinutes);
        
        if (extensionSuccess) {
          toast.success(`Call extended by ${extensionMinutes} minutes`);
          return true;
        }
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

export default CallExtensionHandler;
