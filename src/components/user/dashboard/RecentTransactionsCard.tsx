
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { UserTransaction } from '@/types/supabase/tables';
import { useTransactionAdapter } from '@/hooks/dashboard/useTransactionAdapter';

interface RecentTransactionsCardProps {
  transactions: UserTransaction[];
  loading?: boolean;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ 
  transactions,
  loading = false
}) => {
  const adaptedTransactions = useTransactionAdapter(transactions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Clock className="h-8 w-8 animate-pulse text-muted-foreground" />
          </div>
        ) : adaptedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-4">
            {adaptedTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  {transaction.type === 'credit' || transaction.transaction_type === 'credit' ? (
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{transaction.description || (transaction.type === 'credit' || transaction.transaction_type === 'credit' ? 'Wallet Recharge' : 'Payment')}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date || transaction.created_at ? format(new Date(transaction.date || transaction.created_at), 'PP') : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' || transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' || transaction.transaction_type === 'credit' ? '+' : '-'}
                    {transaction.currency}{transaction.amount}
                  </p>
                  <Badge variant={transaction.type === 'credit' || transaction.transaction_type === 'credit' ? 'outline' : 'secondary'} className="text-xs">
                    {transaction.type === 'credit' || transaction.transaction_type === 'credit' ? 'Credit' : 'Debit'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
