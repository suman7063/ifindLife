
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react'; // Removed PaypalIcon as it doesn't exist

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
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="amount"
                type="number"
                className="pl-8"
                value={amount}
                onChange={handleAmountChange}
                min={10}
                placeholder="Enter amount"
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum amount: $10</p>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card</span>
                  </div>
                </SelectItem>
                <SelectItem value="paypal" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 text-white rounded h-4 w-4 text-[8px] flex items-center justify-center">P</div>
                    <span>PayPal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="border rounded-md p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Visa •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 04/2025</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-muted rounded-md p-3 text-sm">
            <p>You will be recharging <strong>${amount.toFixed(2)}</strong> to your account wallet.</p>
            <p className="text-muted-foreground text-xs mt-1">Transaction fees may apply based on your payment method.</p>
          </div>
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
