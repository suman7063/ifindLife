
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const WalletSection: React.FC = () => {
  const { userProfile } = useAuth();
  const currentUser = ensureUserProfileCompatibility(userProfile);
  const { processPayment, isLoading } = useRazorpayPayment();

  const walletBalance = currentUser?.wallet_balance || 0;
  const currency = currentUser?.currency || 'USD';

  const handleAddFunds = async () => {
    try {
      const amount = currency === 'USD' ? 50 : 500; // $50 or ₹500
      const amountInCents = currency === 'USD' ? amount * 100 : amount * 100; // Convert to cents/paise
      
      await processPayment(
        amountInCents,
        currency as 'INR' | 'USD' | 'EUR',
        `Add ${currency === 'USD' ? '$' : '₹'}${amount} to wallet`,
        (paymentId, orderId) => {
          toast.success(`${currency === 'USD' ? '$' : '₹'}${amount} added to your wallet successfully!`);
          // Here you would update the user's wallet balance in the database
        },
        (error) => {
          toast.error('Payment failed. Please try again.');
          console.error('Payment error:', error);
        }
      );
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-4">
          Current balance: {currency === 'USD' ? '$' : '₹'}{walletBalance.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {currentUser?.transactions && currentUser.transactions.length > 0 
            ? `${currentUser.transactions.length} recent transactions`
            : 'No recent transactions'
          }
        </p>
        <Button 
          onClick={handleAddFunds}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Funds
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
