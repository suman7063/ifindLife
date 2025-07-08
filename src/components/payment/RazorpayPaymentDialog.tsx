import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';
import { toast } from 'sonner';

interface RazorpayPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (error: any) => void;
}

const RazorpayPaymentDialog: React.FC<RazorpayPaymentDialogProps> = ({
  open,
  onOpenChange,
  amount,
  description,
  onSuccess,
  onFailure
}) => {
  const [customAmount, setCustomAmount] = useState(amount);
  const { processPayment, isLoading } = useRazorpayPayment();

  const handlePayment = async () => {
    if (customAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    await processPayment(
      customAmount,
      'INR',
      description,
      (paymentId, orderId) => {
        onSuccess(paymentId, orderId);
        onOpenChange(false);
      },
      (error) => {
        onFailure(error);
        onOpenChange(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
              min="1"
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You will be redirected to Razorpay's secure payment gateway.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isLoading || customAmount <= 0}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : `Pay ₹${customAmount}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPaymentDialog;