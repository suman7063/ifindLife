
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';

interface WalletSummaryProps {
  className?: string;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ className }) => {
  const { userProfile, walletBalance } = useAuth();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">
            {userProfile?.currency || '$'} {walletBalance?.toFixed(2) || '0.00'}
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
