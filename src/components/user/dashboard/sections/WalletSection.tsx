
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, RefreshCcw, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { toast } from 'sonner';

interface WalletSectionProps {
  user: UserProfile;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const { processPayment, isLoading } = useRazorpayPayment();

  const handleAddMoney = async () => {
    try {
      await processPayment(
        {
          amount: 50000, // ₹500 in paise
          currency: 'INR',
          description: 'Wallet Recharge',
        },
        (paymentId, orderId) => {
          toast.success('Wallet recharged successfully!');
          // Here you would update the user's wallet balance in the database
        },
        (error) => {
          toast.error('Payment failed. Please try again.');
          console.error('Payment error:', error);
        }
      );
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error('Error:', error);
    }
  };

  // Mock transactions for demonstration
  const transactions = [
    { 
      id: 1, 
      type: 'credit',
      amount: 500, 
      description: 'Wallet Recharge', 
      date: '2023-05-15T10:30:00', 
      status: 'completed' 
    },
    { 
      id: 2, 
      type: 'debit',
      amount: 250, 
      description: 'Consultation Fee', 
      date: '2023-05-10T14:45:00', 
      status: 'completed' 
    },
    { 
      id: 3, 
      type: 'credit',
      amount: 100, 
      description: 'Referral Bonus', 
      date: '2023-05-05T09:15:00', 
      status: 'completed' 
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
      <p className="text-muted-foreground mb-6">Manage your wallet balance and transactions</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle>Your Balance</CardTitle>
              <CardDescription>Available wallet balance</CardDescription>
            </div>
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user?.currency || '₹'}{user?.wallet_balance?.toFixed(2) || '0.00'}</div>
            <div className="flex space-x-4 mt-4">
              <Button size="sm" onClick={handleAddMoney} disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Add Money'}
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Methods Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Visa •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 04/24</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-3 border-b last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={transaction.type === 'credit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {transaction.type === 'credit' ? '+' : '-'}{user?.currency || '₹'}{transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSection;
