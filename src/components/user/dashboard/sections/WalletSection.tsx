
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowDownUp, Wallet, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WalletSectionProps {
  user: UserProfile | null;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  currency: string;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [isAddingBalance, setIsAddingBalance] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchTransactions = async () => {
      setIsLoading(true);
      
      try {
        // Fetch user transactions from Supabase
        const { data, error } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching transactions:', error);
          toast.error('Failed to load transaction history');
          return;
        }
        
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  const handleBalanceAdd = async () => {
    if (!user) return;
    
    const amountNumber = parseFloat(amount);
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsAddingBalance(true);
    
    try {
      // This would be replaced with actual payment gateway integration
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock transaction
      const transaction = {
        user_id: user.id,
        amount: amountNumber,
        type: 'credit',
        date: new Date().toISOString(),
        currency: user.currency,
        description: 'Wallet recharge'
      };
      
      // Update user wallet balance in Supabase
      const { error: walletError } = await supabase
        .from('users')
        .update({
          wallet_balance: user.wallet_balance + amountNumber
        })
        .eq('id', user.id);
      
      if (walletError) {
        throw walletError;
      }
      
      // Add transaction record
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert(transaction);
      
      if (transactionError) {
        throw transactionError;
      }
      
      toast.success(`Successfully added ${user.currency} ${amountNumber} to your wallet`);
      
      // Refresh page to show updated balance
      window.location.reload();
    } catch (error) {
      console.error('Error adding balance:', error);
      toast.error('Failed to add balance to wallet');
    } finally {
      setIsAddingBalance(false);
      setAmount('');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Manage your wallet and add funds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-muted p-6 rounded-lg flex-grow">
              <div className="flex items-center mb-2">
                <Wallet className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Current Balance</h3>
              </div>
              <p className="text-3xl font-bold">
                {user.currency} {user.wallet_balance.toFixed(2)}
              </p>
            </div>
            
            <div className="border rounded-lg p-6 flex-grow">
              <h3 className="text-lg font-medium mb-4">Add Balance</h3>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  disabled={isAddingBalance}
                />
                <Button 
                  onClick={handleBalanceAdd}
                  disabled={isAddingBalance || !amount}
                >
                  {isAddingBalance ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></span>
                      Adding...
                    </span>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Funds
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                Note: In a production environment, this would connect to a payment gateway
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent wallet transactions</CardDescription>
          </div>
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSection;
