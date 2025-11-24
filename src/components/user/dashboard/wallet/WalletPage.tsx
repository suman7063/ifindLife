
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import WalletBalanceCard from './WalletBalanceCard';
import WalletTransactionsList from './WalletTransactionsList';
import { UserProfile } from '@/types/supabase/user';

interface Props {
  user?: UserProfile | null;
  currentUser?: UserProfile | null;
  [key: string]: unknown;
}

const WalletPage: React.FC<Props> = (props) => {
  const { userProfile } = useAuth();
  const user = (props.user || userProfile) as UserProfile | null;
  // Don't use users.wallet_balance as initial state - balance is calculated from wallet_transactions
  const [balance, setBalance] = useState<number>(0);
  
  const handleBalanceUpdate = (newBalance: number) => {
    setBalance(newBalance);
    // Don't trigger transaction list refresh here - real-time subscription handles it
    // This prevents duplicate refreshes
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your IFL Credits. Use credits to book sessions or add more credits to your wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletBalanceCard user={user} onBalanceUpdate={handleBalanceUpdate} />
        <div className="lg:col-span-2 space-y-6">
          <WalletTransactionsList user={user} />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
