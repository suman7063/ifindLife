
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

const WalletSection: React.FC = () => {
  const { userProfile } = useAuth();
  const currentUser = ensureUserProfileCompatibility(userProfile);

  const walletBalance = currentUser?.walletBalance || currentUser?.wallet_balance || 0;
  const currency = currentUser?.currency || 'USD';

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
          {currentUser?.transactions && currentUser.transactions.length > 0 
            ? `${currentUser.transactions.length} recent transactions`
            : 'No recent transactions'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
