
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { UserTransaction } from '@/types/supabase/tables';
import { Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionHistoryCardProps {
  transactions: UserTransaction[];
  loading: boolean;
}

const TransactionHistoryCard: React.FC<TransactionHistoryCardProps> = ({ transactions, loading }) => {
  const handleDownloadReceipt = (transaction: UserTransaction) => {
    // In a real app, this would generate and download a PDF receipt
    toast.success(`Downloading receipt for transaction ${transaction.id}`);
  };
  
  // Define the columns for the transaction table
  const columns: ColumnDef<UserTransaction>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        // Format date if it exists
        const date = row.getValue('date');
        if (date && typeof date === 'string') {
          return format(parseISO(date), 'MMM dd, yyyy');
        }
        return date;
      }
    },
    {
      accessorKey: 'type',
      header: 'Transaction Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <span className="capitalize">{type.replace('_', ' ')}</span>
        );
      }
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const currency = row.original.currency;
        
        return (
          <span className={amount > 0 ? 'text-green-600' : 'text-red-600'}>
            {amount > 0 ? '+' : ''}{currency} {Math.abs(amount).toFixed(2)}
          </span>
        );
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="icon" 
          title="Download receipt"
          onClick={() => handleDownloadReceipt(row.original)}
        >
          <Download className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your past transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={transactions}
            searchKey="type"
          />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryCard;
