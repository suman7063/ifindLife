
import { useState } from 'react';
import { toast } from 'sonner';

const useRechargeDialog = (onSuccess?: () => void) => {
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  
  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };
  
  const handleCloseRechargeDialog = () => {
    setIsRechargeDialogOpen(false);
  };
  
  const handleRechargeSuccess = () => {
    setIsRechargeDialogOpen(false);
    toast.success('Funds added to your wallet successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return {
    isRechargeDialogOpen,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  };
};

export default useRechargeDialog;
