
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RazorPayCheckout from '@/components/user/RazorPayCheckout';

interface RechargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const RechargeDialog: React.FC<RechargeDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onCancel 
}) => {
  const [rechargeAmount, setRechargeAmount] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recharge Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        
        {parseFloat(rechargeAmount) > 0 ? (
          <RazorPayCheckout 
            amount={parseFloat(rechargeAmount)}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        ) : (
          <Button disabled className="w-full bg-ifind-aqua/50">
            Enter an amount to continue
          </Button>
        )}
        
        <Button type="button" variant="secondary" onClick={onClose} className="mt-2 w-full">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
