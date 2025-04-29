
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
import AmountInput from './payment/AmountInput';
import PaymentMethodSelector from './payment/PaymentMethodSelector';
import PaymentSummary from './payment/PaymentSummary';

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number) => Promise<void>;
}

const RechargeDialog: React.FC<RechargeDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [amount, setAmount] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handleSubmit = async () => {
    if (amount <= 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await onSuccess(amount);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={isProcessing ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recharge Your Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet for seamless payments across our services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <AmountInput 
            amount={amount} 
            onAmountChange={handleAmountChange} 
          />
          
          <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
          
          <PaymentSummary amount={amount} />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || amount <= 0}
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
