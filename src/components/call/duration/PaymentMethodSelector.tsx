
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, CheckCircle } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'wallet' | 'gateway' | null;
  onSelectMethod: (method: 'wallet' | 'gateway') => void;
  walletBalance: number;
  callCost: number;
  formatPrice: (price: number) => string;
  className?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  walletBalance,
  callCost,
  formatPrice,
  className = ''
}) => {
  const hasEnoughBalance = walletBalance >= callCost;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Wallet Payment */}
          <Button
            variant={selectedMethod === 'wallet' ? "default" : "outline"}
            className="w-full h-auto p-4 flex justify-between items-center"
            onClick={() => onSelectMethod('wallet')}
            disabled={!hasEnoughBalance}
          >
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Wallet Payment</span>
                <span className="text-sm text-muted-foreground">
                  Balance: {formatPrice(walletBalance)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasEnoughBalance ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <span className="text-sm text-red-500">Insufficient</span>
              )}
            </div>
          </Button>

          {/* Gateway Payment */}
          <Button
            variant={selectedMethod === 'gateway' ? "default" : "outline"}
            className="w-full h-auto p-4 flex justify-between items-center"
            onClick={() => onSelectMethod('gateway')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Card / UPI Payment</span>
                <span className="text-sm text-muted-foreground">
                  Pay with card, UPI, or net banking
                </span>
              </div>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </Button>
        </div>

        {!hasEnoughBalance && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              <strong>Insufficient wallet balance.</strong> You need {formatPrice(callCost - walletBalance)} more to pay with wallet.
            </p>
          </div>
        )}
        
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Cost:</span>
            <span className="font-bold text-lg">{formatPrice(callCost)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
