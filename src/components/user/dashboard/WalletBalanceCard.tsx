
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard } from 'lucide-react';
import { UserProfile } from '@/types/supabase';

interface WalletBalanceCardProps {
  userProfile: UserProfile | null;
  onRecharge: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ userProfile, onRecharge }) => {
  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Wallet className="mr-2 h-4 w-4 text-ifind-aqua" />
          Wallet Balance
        </CardTitle>
        <CreditCard className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {userProfile?.currency} {userProfile?.walletBalance?.toFixed(2) || '0.00'}
        </div>
        <p className="text-xs text-gray-500">
          Available for transactions and course enrollments
        </p>
      </CardContent>
      <Button onClick={onRecharge} className="w-full mt-4 bg-ifind-aqua hover:bg-ifind-teal transition-colors">
        Recharge Wallet
      </Button>
    </Card>
  );
};

export default WalletBalanceCard;
