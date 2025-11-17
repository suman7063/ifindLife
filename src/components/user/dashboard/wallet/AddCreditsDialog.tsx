import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { toast } from 'sonner';
import { IndianRupee, Euro, Loader2 } from 'lucide-react';
import { useUserCurrency } from '@/hooks/useUserCurrency';

interface AddCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onPaymentReceived?: () => void; // Called immediately when payment is received (before verification)
  onPaymentFailed?: () => void; // Called when payment fails or verification fails
  userCurrency?: string; // Optional override, will use hook if not provided
}

const AddCreditsDialog: React.FC<AddCreditsDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onPaymentReceived,
  onPaymentFailed,
  userCurrency
}) => {
  const [amount, setAmount] = useState<string>('');
  const { processPayment, isLoading } = useRazorpayPayment();
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  
  // Use hook to get currency, but allow override via prop
  const currencyHook = useUserCurrency();
  const currency = (userCurrency || currencyHook.code).toUpperCase() as 'INR' | 'EUR';
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
      // Close dialog before opening Razorpay to prevent overlap
      onClose();

      // Process payment via Razorpay
      // The loader will be shown via isLoading from the hook
      await processPayment(
        {
          amount: creditAmount, // Amount in currency units (will be converted in backend)
          currency: currency as 'INR' | 'EUR',
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
          onPaymentFailed?.();
        },
        () => {
          // onPaymentReceived - called immediately when payment is received (before verification)
          // This triggers the wallet balance loader immediately
          onPaymentReceived?.();
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };


  return (
    <>
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
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddCredits} disabled={isLoading || !amount}>
                {isLoading ? 'Processing...' : `Add ${amount ? `${symbol}${parseFloat(amount).toFixed(0)}` : 'Credits'}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Full-screen loader overlay that stays visible until Razorpay modal opens */}
      {/* This is outside the Dialog so it remains visible even after dialog closes */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-semibold">Opening Payment Gateway</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we connect to Razorpay...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCreditsDialog;

