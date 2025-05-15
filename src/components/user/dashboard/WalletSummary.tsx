
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { formatCurrency } from '@/utils/formatters';

export interface WalletSummaryProps {
  userProfile: UserProfile | null;
  loading?: boolean;
  showTransactions?: boolean;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ 
  userProfile, 
  loading = false,
  showTransactions = false
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
          {showTransactions && (
            <div className="space-y-2 mt-4">
              <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const currency = userProfile?.currency || 'USD';
  const balance = userProfile?.wallet_balance || 0;
  const formattedBalance = formatCurrency(balance, currency);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formattedBalance}</div>
        
        {showTransactions && userProfile?.transactions && userProfile.transactions.length > 0 ? (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-medium">Recent Transactions</h4>
            
            <div className="space-y-2">
              {userProfile.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <span className="font-medium">{transaction.type}</span>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : showTransactions ? (
          <p className="text-sm text-muted-foreground mt-4">No transactions yet</p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
