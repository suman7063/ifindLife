
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface UserWalletProps {
  user: UserProfile | null;
}

const UserWallet: React.FC<UserWalletProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Wallet</h2>
        <p className="text-muted-foreground">
          Manage your balance and transaction history
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Current Balance</CardTitle>
          <Wallet className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {user?.currency || '$'}{user?.wallet_balance?.toFixed(2) || '0.00'}
          </div>
          <p className="text-muted-foreground mt-1">
            Available for consultations and services
          </p>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
            <div className="text-center py-6 bg-muted rounded-md">
              <p className="text-muted-foreground">No recent transactions to display.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWallet;
