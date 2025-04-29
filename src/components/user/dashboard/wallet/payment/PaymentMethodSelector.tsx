
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import PaymentMethodItem from './PaymentMethodItem';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onPaymentMethodChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Payment Method</Label>
      <Select 
        value={paymentMethod} 
        onValueChange={onPaymentMethodChange}
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

      {paymentMethod === 'card' && <PaymentMethodItem type="card" />}
    </div>
  );
};

export default PaymentMethodSelector;
