
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getUserWalletBalance, getUserTransactions } from '@/utils/profileHelpers';

const WalletSection: React.FC = () => {
  const { userProfile } = useAuth();
  const walletBalance = getUserWalletBalance(userProfile);
  const transactions = getUserTransactions(userProfile);
  const currency = userProfile?.currency || 'USD';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-2">
          Current balance: {currency === 'USD' ? '$' : '₹'}{walletBalance.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground">
          {transactions && transactions.length > 0 
            ? `${transactions.length} recent transactions`
            : 'No recent transactions'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
