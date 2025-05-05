
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AmountInputProps {
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, onAmountChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount (INR)</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-muted-foreground">₹</span>
        </div>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={onAmountChange}
          className="pl-8"
          min={10}
        />
      </div>
      <p className="text-xs text-muted-foreground">Minimum recharge amount: ₹10</p>
    </div>
  );
};

export default AmountInput;
