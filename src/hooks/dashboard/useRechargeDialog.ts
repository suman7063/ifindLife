
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/UserAuthContext';

const useRechargeDialog = (onSuccess?: () => Promise<void>) => {
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useUserAuth();
  
  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };
  
  const handleCloseRechargeDialog = () => {
    setIsRechargeDialogOpen(false);
  };
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };
  
  const handleRechargeWallet = async () => {
    if (!currentUser?.id || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // For demo purposes, directly update wallet balance
      // In production, this would be handled by a payment gateway
      
      // 1. Get current wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();
      
      if (walletError) throw walletError;
      
      const newBalance = (wallet?.balance || 0) + amount;
      
      // 2. Update wallet balance
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);
      
      if (updateError) throw updateError;
      
      // 3. Record transaction
      await supabase
        .from('wallet_transactions')
        .insert([{
          user_id: currentUser.id,
          amount: amount,
          currency: 'INR',
          status: 'completed',
          transaction_type: 'recharge',
          description: 'Wallet recharge',
          payment_method: 'demo',
          created_at: new Date().toISOString()
        }]);
      
      toast.success(`Successfully added ₹${amount} to your wallet`);
      
      if (onSuccess) {
        await onSuccess();
      }
      
      handleCloseRechargeDialog();
    } catch (error: any) {
      console.error('Error processing recharge:', error);
      toast.error('Failed to process recharge');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRechargeSuccess = async () => {
    if (onSuccess) {
      await onSuccess();
    }
  };
  
  return {
    isRechargeDialogOpen,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess,
    isProcessing,
    amount,
    handleAmountChange,
    handleRecharge: handleRechargeWallet
  };
};

export default useRechargeDialog;
