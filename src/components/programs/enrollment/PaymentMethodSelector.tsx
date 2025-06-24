
import React from 'react';
import { CheckCircle, Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserProfile } from '@/types/database/unified';
import { getUserWalletBalance } from '@/utils/profileHelpers';

interface PaymentMethodSelectorProps {
  currentUser: UserProfile;
  enrollmentMethod: 'wallet' | 'gateway';
  hasEnoughBalance: boolean;
  setEnrollmentMethod: (method: 'wallet' | 'gateway') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  currentUser,
  enrollmentMethod,
  hasEnoughBalance,
  setEnrollmentMethod
}) => {
  const walletBalance = getUserWalletBalance(currentUser);

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Choose payment method:</h4>
      
      <div 
        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
          enrollmentMethod === 'wallet' ? 'border-ifind-purple bg-ifind-purple/5' : ''
        }`}
        onClick={() => setEnrollmentMethod('wallet')}
      >
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-ifind-purple" />
          <div>
            <h3 className="font-medium">Pay with Wallet</h3>
            <p className="text-sm text-muted-foreground">Current Balance: ₹{walletBalance}</p>
          </div>
        </div>
        {enrollmentMethod === 'wallet' && (
          <CheckCircle className="h-5 w-5 text-ifind-purple" />
        )}
      </div>
      
      {!hasEnoughBalance && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Insufficient Balance</AlertTitle>
          <AlertDescription>
            Your wallet balance is less than the program fee. Please recharge your wallet or choose another payment method.
          </AlertDescription>
        </Alert>
      )}
      
      <div 
        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
          enrollmentMethod === 'gateway' ? 'border-ifind-purple bg-ifind-purple/5' : ''
        }`}
        onClick={() => setEnrollmentMethod('gateway')}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-ifind-purple" />
          <div>
            <h3 className="font-medium">Pay with Card/UPI</h3>
            <p className="text-sm text-muted-foreground">Secure online payment</p>
          </div>
        </div>
        {enrollmentMethod === 'gateway' && (
          <CheckCircle className="h-5 w-5 text-ifind-purple" />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
