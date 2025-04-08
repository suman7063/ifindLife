
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { UserTransaction } from '@/types/supabase/tables';

interface RecentTransactionsCardProps {
  transactions: UserTransaction[];
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ transactions }) => {
  // Show only the most recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    (transaction.type?.toLowerCase() === 'credit' || transaction.transaction_type?.toLowerCase() === 'credit') 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {(transaction.type?.toLowerCase() === 'credit' || transaction.transaction_type?.toLowerCase() === 'credit') ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.description || 
                        ((transaction.type?.toLowerCase() === 'credit' || transaction.transaction_type?.toLowerCase() === 'credit') ? 'Wallet Recharge' : 'Purchase')}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date || transaction.created_at || '')}</p>
                  </div>
                </div>
                <p className={`font-medium ${
                  (transaction.type?.toLowerCase() === 'credit' || transaction.transaction_type?.toLowerCase() === 'credit') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(transaction.type?.toLowerCase() === 'credit' || transaction.transaction_type?.toLowerCase() === 'credit') ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
