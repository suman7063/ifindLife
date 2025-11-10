import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { toast } from 'sonner';
import { IndianRupee, Euro } from 'lucide-react';

interface AddCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userCurrency?: string;
}

const AddCreditsDialog: React.FC<AddCreditsDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userCurrency = 'INR'
}) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { processPayment } = useRazorpayPayment();
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

  const currency = userCurrency || 'INR';
  const symbol = currency === 'INR' ? '₹' : '€';
  const CurrencyIcon = currency === 'INR' ? IndianRupee : Euro;

  const presetAmounts = currency === 'INR' 
    ? [500, 1000, 2000, 5000]
    : [10, 25, 50, 100];

  const handleAddCredits = async () => {
    const creditAmount = parseFloat(amount);
    
    if (!creditAmount || creditAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (creditAmount < (currency === 'INR' ? 100 : 5)) {
      toast.error(`Minimum amount is ${symbol}${currency === 'INR' ? 100 : 5}`);
      return;
    }

    try {
      setLoading(true);

      // Close dialog before opening Razorpay to prevent overlap
      onClose();

      // Process payment via Razorpay
      await processPayment(
        {
          amount: creditAmount, // Amount in currency units (will be converted in backend)
          currency: currency as 'INR' | 'USD',
          description: `Add ${symbol}${creditAmount} credits to wallet`,
          // Not passing expertId, serviceId, or callSessionId to ensure itemType is set to 'wallet'
        },
        async (paymentId: string, orderId: string) => {
          // Payment successful - credits will be added via webhook
          toast.success(`${symbol}${creditAmount} credits will be added to your wallet!`);
          onSuccess?.();
          onClose();
          setAmount('');
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Credits to Wallet</DialogTitle>
          <DialogDescription>
            Add IFL Credits to your wallet. Credits can be used to book sessions.
            <br />
            <span className="text-sm font-medium">1 Credit = {symbol}1</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ({currency})</Label>
            <div className="relative mt-1">
              <CurrencyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder={`Enter amount (min ${symbol}${currency === 'INR' ? 100 : 5})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min={currency === 'INR' ? 100 : 5}
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You will receive {amount ? parseFloat(amount).toFixed(0) : '0'} credits
            </p>
          </div>

          <div>
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className={amount === preset.toString() ? 'bg-primary text-primary-foreground' : ''}
                >
                  {symbol}{preset}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-md p-3 text-sm">
            <p className="text-muted-foreground">
              <strong>Note:</strong> Credits are non-refundable and expire 12 months from purchase.
              Credits can only be used on the iFindLife platform.
            </p>
          </div>

          {isDevelopment && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
              <p className="text-blue-800">
                <strong>🧪 Testing:</strong> Use Razorpay test cards for testing payments. Test card: <code className="bg-blue-100 px-1 rounded">4111 1111 1111 1111</code> (any CVV, any future expiry date).
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddCredits} disabled={loading || !amount}>
              {loading ? 'Processing...' : `Add ${amount ? `${symbol}${parseFloat(amount).toFixed(0)}` : 'Credits'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCreditsDialog;

