
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase';
import { formatCurrency } from '@/utils/formatters';
import { Wallet } from 'lucide-react';

interface WalletBalanceCardProps {
  userProfile: UserProfile;
  onRecharge: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ userProfile, onRecharge }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Balance</h3>
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-muted-foreground" />
            <span className="text-3xl font-bold">
              {formatCurrency(userProfile.wallet_balance)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your wallet balance can be used to book sessions with experts and purchase programs.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRecharge} className="w-full">
          Add Funds
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletBalanceCard;
