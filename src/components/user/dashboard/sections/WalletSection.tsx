
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Wallet, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WalletSection = () => {
  const { userProfile } = useSimpleAuth();
  
  const walletBalance = userProfile?.wallet_balance || 0;
  const currency = userProfile?.currency || 'USD';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency} {walletBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for bookings and services
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button className="w-full" variant="outline">
              <History className="w-4 h-4 mr-2" />
              Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSection;
