
import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodItemProps {
  type: 'card' | 'paypal';
  lastFour?: string;
  expiryDate?: string;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({ 
  type, 
  lastFour = '4242', 
  expiryDate = '04/2025' 
}) => {
  return (
    <div className="border rounded-md p-3 bg-muted/50">
      <div className="flex items-center gap-2">
        {type === 'card' ? (
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        ) : (
          <div className="bg-blue-500 text-white rounded h-4 w-4 text-[8px] flex items-center justify-center">P</div>
        )}
        <div>
          <p className="text-sm font-medium">
            {type === 'card' ? `Visa •••• ${lastFour}` : 'PayPal'}
          </p>
          {type === 'card' && expiryDate && (
            <p className="text-xs text-muted-foreground">Expires {expiryDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodItem;
