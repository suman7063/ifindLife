import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodSelectorProps {
  selectedMethod: 'wallet' | 'gateway';
  onMethodChange: (method: 'wallet' | 'gateway') => void;
  walletBalance: number;
  requiredAmount: number;
  currency: string;
  loading?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  walletBalance,
  requiredAmount,
  currency,
  loading = false
}) => {
  const navigate = useNavigate();
  
  // Ensure all values are numbers
  const safeWalletBalance = typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 0;
  const safeRequiredAmount = typeof requiredAmount === 'number' && !isNaN(requiredAmount) ? requiredAmount : 0;
  
  const symbol = currency === 'INR' ? '₹' : '€';
  const hasSufficientBalance = safeWalletBalance >= safeRequiredAmount;
  const balanceShortfall = Math.max(0, safeRequiredAmount - safeWalletBalance);

  // Handle payment method change with redirect for insufficient balance
  const handleMethodChange = (value: string) => {
    const method = value as 'wallet' | 'gateway';
    
    // If user tries to select wallet with insufficient balance, redirect to wallet recharge
    if (method === 'wallet' && !hasSufficientBalance && safeRequiredAmount > 0) {
      toast.error('Insufficient Wallet Balance', {
        description: `You need ${symbol}${balanceShortfall.toFixed(2)} more. Redirecting to wallet recharge...`,
        duration: 3000
      });
      
      // Redirect to wallet page after a short delay
      setTimeout(() => {
        navigate('/user-dashboard/wallet');
      }, 500);
      return;
    }
    
    // Otherwise, proceed with normal method change
    onMethodChange(method);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to pay for this booking
        </p>
      </div>

      <RadioGroup
        value={selectedMethod}
        onValueChange={handleMethodChange}
        disabled={loading}
      >
        <div className="space-y-3">
          {/* Wallet Option */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedMethod === 'wallet' ? 'ring-2 ring-primary' : ''
            } ${!hasSufficientBalance ? 'opacity-60' : ''}`}
            onClick={() => {
              // Allow clicking on card even if radio is disabled
              if (!hasSufficientBalance && safeRequiredAmount > 0) {
                handleMethodChange('wallet');
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="wallet" id="wallet" disabled={!hasSufficientBalance || loading} />
                <Wallet className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="wallet" className="cursor-pointer font-medium">
                    Pay with Wallet
                  </Label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                      Available: {symbol}{safeWalletBalance.toFixed(2)}
                    </p>
                    {!hasSufficientBalance && safeRequiredAmount > 0 && (
                      <span className="text-xs text-red-600">
                        Need {symbol}{balanceShortfall.toFixed(2)} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Gateway Option */}
          <Card className={`cursor-pointer transition-all ${
            selectedMethod === 'gateway' ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="gateway" id="gateway" disabled={loading} />
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="gateway" className="cursor-pointer font-medium">
                    Pay via Payment Gateway
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Credit/Debit Card, UPI, Net Banking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>

      {selectedMethod === 'wallet' && !hasSufficientBalance && safeRequiredAmount > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Insufficient wallet balance. You need {symbol}{balanceShortfall.toFixed(2)} more.
            <br />
            <a
              href="/user-dashboard/wallet"
              className="underline font-medium mt-1 inline-block"
            >
              Add credits to wallet
            </a>
          </AlertDescription>
        </Alert>
      )}

      {selectedMethod === 'wallet' && hasSufficientBalance && safeRequiredAmount > 0 && (
        <Alert>
          <AlertDescription>
            {symbol}{safeRequiredAmount.toFixed(2)} will be deducted from your wallet balance.
            <br />
            Remaining balance: {symbol}{(safeWalletBalance - safeRequiredAmount).toFixed(2)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PaymentMethodSelector;

