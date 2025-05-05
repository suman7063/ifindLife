
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign } from 'lucide-react';
import { UserProfile } from '@/types/supabase';

interface WalletSectionProps {
  user: UserProfile | null;
  onRecharge?: () => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user, onRecharge }) => {
  console.log('Rendering WalletSection with user:', user?.id);
  
  // Ensure we have user data before rendering
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wallet</CardTitle>
          <CardDescription>Manage your wallet balance</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p>User profile data is loading...</p>
        </CardContent>
      </Card>
    );
  }

  const walletBalance = user.wallet_balance || 0;
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: user.currency || 'USD'
  }).format(walletBalance);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Wallet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>Your available funds</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CircleDollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{formattedBalance}</h3>
              <p className="text-muted-foreground mt-2">{user.currency || 'USD'}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={onRecharge}
              disabled={!onRecharge}
            >
              Add Funds
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No recent transactions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletSection;
