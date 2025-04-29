
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Wallet } from 'lucide-react';

interface WalletBalanceCardProps {
  user: UserProfile | null;
  onRecharge: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ user, onRecharge }) => {
  return (
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
        
        <Button className="w-full" onClick={onRecharge}>
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
  );
};

export default WalletBalanceCard;
