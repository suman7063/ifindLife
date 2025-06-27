
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, History } from 'lucide-react';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

interface WalletPageProps {
  user: UserProfile | any;
}

const WalletPage: React.FC<WalletPageProps> = ({ user }) => {
  // Adapt user profile to ensure consistent structure
  const adaptedUser = adaptUserProfile(user);

  const handleRecharge = (amount: number) => {
    // Implement recharge logic
    console.log('Recharging wallet with:', amount);
  };

  const transactions = [
    {
      id: '1',
      type: 'credit',
      amount: 50.00,
      description: 'Wallet recharge',
      date: '2023-12-15',
      currency: adaptedUser.currency
    },
    {
      id: '2',
      type: 'debit',
      amount: 25.00,
      description: 'Consultation with Dr. Smith',
      date: '2023-12-14',
      currency: adaptedUser.currency
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-gray-600 mt-1">Manage your account balance and transactions</p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {adaptedUser.currency === 'USD' ? '$' : '₹'}{adaptedUser.wallet_balance.toFixed(2)} {adaptedUser.currency}
          </div>
        </CardContent>
      </Card>

      {/* Recharge Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Money
          </CardTitle>
          <CardDescription>
            Recharge your wallet to pay for consultations and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Enter amount" type="number" className="flex-1" />
            <Button onClick={() => handleRecharge(100)}>
              Add Money
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            {[50, 100, 200, 500].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => handleRecharge(amount)}
              >
                {adaptedUser.currency === 'USD' ? '$' : '₹'}{amount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {transaction.currency === 'USD' ? '$' : '₹'}{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;
