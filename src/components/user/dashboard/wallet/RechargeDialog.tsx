
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
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';
import { toast } from 'sonner';

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
  const { processPayment, isLoading } = useRazorpayPayment();
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handleSubmit = async () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await processPayment(
        amount,
        'INR',
        'Wallet Recharge',
        async (paymentId: string, orderId: string) => {
          console.log('Payment successful:', { paymentId, orderId });
          await onSuccess(amount);
          toast.success('Wallet recharged successfully!');
          onOpenChange(false);
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
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
            disabled={isProcessing || isLoading || amount <= 0}
          >
            {(isProcessing || isLoading) ? 'Processing...' : `Pay ₹${amount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
