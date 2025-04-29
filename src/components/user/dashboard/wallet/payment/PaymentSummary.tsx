
import React from 'react';

interface PaymentSummaryProps {
  amount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ amount }) => {
  return (
    <div className="bg-muted rounded-md p-3 text-sm">
      <p>You will be recharging <strong>${amount.toFixed(2)}</strong> to your account wallet.</p>
      <p className="text-muted-foreground text-xs mt-1">
        Transaction fees may apply based on your payment method.
      </p>
    </div>
  );
};

export default PaymentSummary;
