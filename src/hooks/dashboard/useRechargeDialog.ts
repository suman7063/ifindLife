
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useRechargeDialog = (user: User | null, refreshBalance: () => Promise<void>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState(0);

  const openDialog = () => {
    setAmount(0);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleRecharge = async () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add funds');
      return;
    }

    try {
      setIsProcessing(true);
      
      // In a real app, this would integrate with a payment gateway
      toast.success(`Added ${amount} credits to your wallet`);
      
      // Refresh the wallet balance
      await refreshBalance();
      
      // Close the dialog
      closeDialog();
    } catch (error) {
      console.error('Error processing recharge:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isDialogOpen,
    isProcessing,
    amount,
    openDialog,
    closeDialog,
    handleAmountChange,
    handleRecharge
  };
};

export default useRechargeDialog;
