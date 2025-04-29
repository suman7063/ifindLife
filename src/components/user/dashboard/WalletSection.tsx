import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { UserTransaction } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Download, Filter, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import useTransactions from '@/hooks/dashboard/useTransactions';

interface WalletSectionProps {
  user: UserProfile | null;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const [rechargeAmount, setRechargeAmount] = useState(50);
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  
  const { transactions, isLoading: loading, refreshTransactions } = useTransactions(user?.id);

  // Define the columns for the transaction table
  const columns: ColumnDef<UserTransaction>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
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
      cell: () => (
        <Button variant="ghost" size="icon" title="Download receipt">
          <Download className="h-4 w-4" />
        </Button>
      )
    }
  ];
  
  const handleRecharge = () => {
    // TODO: Implement actual payment integration
    console.log(`Recharging wallet with amount: ${rechargeAmount}`);
    setOpenRechargeDialog(false);
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
            
            <Dialog open={openRechargeDialog} onOpenChange={setOpenRechargeDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Recharge Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recharge Your Wallet</DialogTitle>
                  <DialogDescription>
                    Add funds to your wallet to use for consultations and services
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(Number(e.target.value))}
                      min={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select defaultValue="card">
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2 rounded-md border p-4">
                      <CreditCard className="h-4 w-4" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Credit Card</p>
                        <p className="text-xs text-muted-foreground">**** **** **** 4242</p>
                      </div>
                      <Select defaultValue="saved">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saved">Saved Card</SelectItem>
                          <SelectItem value="new">New Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenRechargeDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRecharge}>
                    Proceed to Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              
              <Button variant="outline" className="w-full mt-2">
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
    </div>
  );
};

export default WalletSection;
