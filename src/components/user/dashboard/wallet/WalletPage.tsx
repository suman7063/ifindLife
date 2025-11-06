
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import WalletBalanceCard from './WalletBalanceCard';
import WalletTransactionsList from './WalletTransactionsList';

interface Props {
  user?: any;
  currentUser?: any;
  [key: string]: any;
}

const WalletPage: React.FC<Props> = (props) => {
  const { userProfile } = useAuth();
  const user = props.user || userProfile;
  const [balance, setBalance] = useState<number>(user?.wallet_balance || 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your IFL Credits. Use credits to book sessions or add more credits to your wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletBalanceCard user={user} onBalanceUpdate={setBalance} />
        <div className="lg:col-span-2 space-y-6">
          <WalletTransactionsList user={user} />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
