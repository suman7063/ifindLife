
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { UserTransaction } from '@/types/supabase/tables';

interface TransactionHistoryCardProps {
  transactions: UserTransaction[];
  loading: boolean;
}

const TransactionHistoryCard: React.FC<TransactionHistoryCardProps> = ({ transactions, loading }) => {
  if (loading) {
    return <div className="py-8 text-center">Loading transaction data...</div>;
  }

  if (transactions.length === 0) {
    return <div className="py-8 text-center">No transactions found</div>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Transaction Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">
                    {transaction.type.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryCard;
