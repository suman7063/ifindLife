
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Wallet } from 'lucide-react';

interface WalletBalanceCardProps {
  user: UserProfile | null;
  onRecharge: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ user, onRecharge }) => {
  return (
    <Card className="col-span-1">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2">Your Wallet</h3>
        <p className="text-muted-foreground text-sm mb-4">Current balance and recharge options</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <h2 className="text-3xl font-bold">
              {user?.currency || 'INR'} {user?.wallet_balance?.toFixed(2) || '0.00'}
            </h2>
          </div>
          
          <Button 
            onClick={onRecharge} 
            className="w-full"
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Recharge Wallet
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        * Funds in your wallet can be used for any service on the platform
      </CardFooter>
    </Card>
  );
};

export default WalletBalanceCard;
