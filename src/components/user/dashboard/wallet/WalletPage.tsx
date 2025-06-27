
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, History } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';

interface Props {
  user?: any;
  currentUser?: any;
  [key: string]: any;
}

const WalletPage: React.FC<Props> = (props) => {
  const { userProfile } = useAuth();
  const user = props.user || userProfile;
  
  const balance = user?.wallet_balance || user?.walletBalance || 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-gray-600">Manage your account balance and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Balance
            </CardTitle>
            <CardDescription>Your available wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${balance}
            </div>
            <div className="mt-4 space-x-2">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
