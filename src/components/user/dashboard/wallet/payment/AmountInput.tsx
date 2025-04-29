
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AmountInputProps {
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minAmount?: number;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  amount, 
  onAmountChange, 
  minAmount = 10 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5">$</span>
        <Input
          id="amount"
          type="number"
          className="pl-8"
          value={amount}
          onChange={onAmountChange}
          min={minAmount}
          placeholder="Enter amount"
        />
      </div>
      <p className="text-xs text-muted-foreground">Minimum amount: ${minAmount}</p>
    </div>
  );
};

export default AmountInput;
