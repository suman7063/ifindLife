
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/database/unified';
import { formatCurrency } from '@/utils/formatters';

interface WalletSummaryProps {
  className?: string;
  user?: UserProfile;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ className, user }) => {
  const auth = useAuth();
  const userProfile = user || auth.userProfile;
  const walletBalance = userProfile?.wallet_balance || 0;
  const currency = userProfile?.currency || 'USD';
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">
            {formatCurrency(walletBalance, currency)}
          </div>
          <p className="text-sm text-muted-foreground">
            Available balance in your account
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
