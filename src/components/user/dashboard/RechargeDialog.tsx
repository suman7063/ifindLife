
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { CreditCard } from 'lucide-react';

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RechargeDialog: React.FC<RechargeDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [amount, setAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const { rechargeWallet } = useUserAuth();

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await rechargeWallet(amount);
      setIsProcessing(false);
      onSuccess();
    } catch (error) {
      console.error('Recharge failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add funds to your wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet. This is a simulated payment for demonstration purposes.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleRechargeSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-8"
                  min={1}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isProcessing || amount <= 0}>
              {isProcessing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> 
                  Add Funds
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
