
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTransaction } from '@/types/supabase';
import { formatCurrency } from '@/utils/formatters';

export interface RecentTransactionsCardProps {
  transactions: UserTransaction[];
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ transactions }) => {
  // If there are no transactions, show a message
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Show the most recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <div 
              key={transaction.id || index} 
              className="flex justify-between items-center border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                {transaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
