
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { UserTransaction } from '@/types/supabase/tables';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Download, Filter, CreditCard } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import useTransactions from '@/hooks/dashboard/useTransactions';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';
import RechargeDialog from './RechargeDialog';

interface WalletSectionProps {
  user: UserProfile | null;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const { transactions, isLoading: loading, refreshTransactions } = useTransactions(user?.id);

  const {
    isRechargeDialogOpen,
    isProcessing,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  } = useRechargeDialog(refreshTransactions);

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
  
  const handleDownloadReceipt = (transaction: UserTransaction) => {
    // In a real app, this would generate and download a PDF receipt
    toast.success(`Downloading receipt for transaction ${transaction.id}`);
  };
  
  const handleAddPaymentMethod = () => {
    // In a real app, this would show a form to add a new payment method
    toast.info('Add payment method functionality will be implemented in a future update');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Wallet & Transactions</h2>
        <p className="text-muted-foreground">
          Manage your wallet and view transaction history
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Wallet</CardTitle>
            <CardDescription>Current balance and recharge options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <h3 className="text-3xl font-bold">
                  {user?.currency || '$'}{user?.wallet_balance?.toFixed(2) || '0.00'}
                </h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <Button className="w-full" onClick={handleOpenRechargeDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Recharge Wallet
            </Button>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              * Funds in your wallet can be used for any service on the platform
            </div>
          </CardFooter>
        </Card>
        
        {/* Payment Methods */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-md border p-4">
                <CreditCard className="h-5 w-5" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 04/2025</p>
                </div>
                <Button variant="outline" size="sm">Set as Default</Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={handleAddPaymentMethod}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
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
      
      <RechargeDialog
        open={isRechargeDialogOpen}
        onOpenChange={handleCloseRechargeDialog}
        onSuccess={handleRechargeSuccess}
      />
    </div>
  );
};

export default WalletSection;
