
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/database/unified';
import { formatCurrency } from '@/utils/formatters';

interface WalletSummaryProps {
  className?: string;
  user?: UserProfile;
  showTransactions?: boolean;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ className, user, showTransactions }) => {
  const auth = useAuth();
  const userProfile = user || auth.userProfile;
  const walletBalance = userProfile?.wallet_balance || 0;
  const currency = userProfile?.currency || 'USD';
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">
            {formatCurrency(walletBalance, currency)}
          </div>
          <p className="text-sm text-muted-foreground">
            Available balance in your account
          </p>
          
          {showTransactions && userProfile?.transactions && userProfile.transactions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recent Transactions</h4>
              <div className="space-y-2">
                {userProfile.transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="flex justify-between text-sm">
                    <span>{transaction.description}</span>
                    <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
