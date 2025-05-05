
import React from 'react';

interface PaymentSummaryProps {
  amount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ amount }) => {
  // Calculate the processor fee (example: 2%)
  const processorFee = amount * 0.02;
  const totalAmount = amount + processorFee;
  
  return (
    <div className="space-y-2 border-t pt-4 mt-2">
      <h3 className="font-medium">Payment Summary</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span>₹{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Processing Fee (2%):</span>
          <span>₹{processorFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
