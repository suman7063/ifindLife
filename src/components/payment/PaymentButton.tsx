import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useRazorpayPayment } from '@/hooks/payment/useRazorpayPayment';

interface PaymentButtonProps {
  amount: number;
  currency: 'INR' | 'EUR';
  expertId: string;
  duration: number;
  formatPrice: (price: number) => string;
  onPaymentSuccess: (sessionData: any) => void;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency,
  expertId,
  duration,
  formatPrice,
  onPaymentSuccess,
  disabled = false
}) => {
  const { initiatePayment, isLoading } = useRazorpayPayment();

  const handlePayment = async () => {
    try {
      const sessionData = await initiatePayment({
        amount,
        currency,
        expertId,
        duration
      });
      
      onPaymentSuccess(sessionData);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay {formatPrice(amount)} & Start Session
        </>
      )}
    </Button>
  );
};

export default PaymentButton;