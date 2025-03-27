
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { UserTransaction } from '@/types/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentTransactionsCardProps {
  transactions: UserTransaction[];
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ transactions }) => {
  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center">
          <CreditCard className="mr-2 h-4 w-4 text-ifind-aqua" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="text-right">{transaction.currency} {transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-gray-500">No recent transactions</div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
