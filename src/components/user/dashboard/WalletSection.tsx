
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase/user';
import { PlusCircle, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface WalletSectionProps {
  user: UserProfile;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const transactions = user.transactions || [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Wallet</CardTitle>
          <CardDescription>Manage your wallet balance and see your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80 mb-1">Current Balance</p>
                <h3 className="text-3xl font-bold">{user.currency} {user.wallet_balance?.toFixed(2)}</h3>
              </div>
              <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Transaction History</h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div key={transaction.id || index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? 
                        <ArrowDownRight className="h-4 w-4" /> : 
                        <ArrowUpRight className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || (transaction.type === 'credit' ? 'Deposit' : 'Payment')}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={transaction.type === 'credit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {transaction.type === 'credit' ? '+' : '-'} {transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p>No transactions yet</p>
                <Button variant="link" size="sm" className="mt-2">
                  Add funds to get started
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSection;
