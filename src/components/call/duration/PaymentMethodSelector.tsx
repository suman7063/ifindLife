
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'gateway' | null;
  onSelectMethod: (method: 'gateway') => void;
  callCost: number;
  formatPrice: (price: number) => string;
  className?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  callCost,
  formatPrice,
  className = ''
}) => {

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
          {/* Gateway Payment - Only option now */}
          <Button
            variant={selectedMethod === 'gateway' ? "default" : "outline"}
            className="w-full h-auto p-4 flex justify-between items-center"
            onClick={() => onSelectMethod('gateway')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Secure Payment</span>
                <span className="text-sm text-muted-foreground">
                  Pay with card, UPI, or net banking
                </span>
              </div>
            </div>
          </Button>
        </div>
        
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
