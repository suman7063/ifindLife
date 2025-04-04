
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase';
import { formatCurrency } from '@/utils/formatters';
import { PlusCircle } from 'lucide-react';

export interface WalletBalanceCardProps {
  userProfile: UserProfile;
  onRecharge: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ 
  userProfile,
  onRecharge
}) => {
  const balance = userProfile.wallet_balance || 0;
  const currency = userProfile.currency || 'USD';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Wallet Balance
        </CardTitle>
        <Button 
          onClick={onRecharge}
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Funds</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(balance, currency)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Available for consultations and programs
        </p>
      </CardContent>
    </Card>
  );
};

export default WalletBalanceCard;
