
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';

interface WalletSummaryProps {
  user: UserProfile | null;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ user }) => {
  const walletBalance = user?.wallet_balance || 0;
  const currency = user?.currency || 'USD';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-3xl font-bold">
            {currency === 'USD' ? '$' : '₹'}{walletBalance.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Available for bookings and services
          </p>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
            Recharge Wallet
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
