
import { useState } from 'react';
import { toast } from 'sonner';

const useRechargeDialog = (refreshTransactions: () => void) => {
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };

  const handleCloseRechargeDialog = () => {
    if (!isProcessing) {
      setIsRechargeDialogOpen(false);
    }
  };

  const handleRechargeSuccess = async (amount: number) => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call an API to add funds
      // For now, let's simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully added $${amount.toFixed(2)} to your wallet`);
      refreshTransactions();
      setIsRechargeDialogOpen(false);
    } catch (error) {
      console.error('Error processing wallet recharge:', error);
      toast.error('Failed to recharge wallet. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRechargeDialogOpen,
    isProcessing,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  };
};

export default useRechargeDialog;
